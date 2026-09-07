function runSortorder(source, attributes, iterate, read) {
  var data = app.module.data,
    element = createElement('div'),
    rendered,
    originalTraverse = data._traverse

  for (var name in attributes) {
    if (attributes.hasOwnProperty(name)) element.setAttribute(name, attributes[name])
  }
  app.element.saveOriginalValues(element)
  data._traverse = function (options, response) {
    rendered = read(response)
  }

  try {
    data._run({ storageKey: 'sortorder-' + Math.random(), iterate: iterate, element: element }, source)
  } finally {
    data._traverse = originalTraverse
  }

  return rendered
}

test('data-sortorder - sorts strings ascending and descending', function () {
  if (!app.module.data) return

  var source = { data: { items: [{ title: 'Zeta' }, { title: 'Alpha' }, { title: 'Beta' }] }, status: 200 }
  var asc = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'title',
    'data-sortorder': 'asc'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.title }).join(',')
  })
  var desc = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'title',
    'data-sortorder': 'desc'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.title }).join(',')
  })

  assertEqual(asc, 'Alpha,Beta,Zeta')
  assertEqual(desc, 'Zeta,Beta,Alpha')
  assertEqual(source.data.items[0].title, 'Zeta')
})

test('data-sortorder - sorts numeric values ascending and descending', function () {
  if (!app.module.data) return

  var source = { data: { items: [{ score: 10 }, { score: 2 }, { score: 1 }] }, status: 200 }
  var asc = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'score',
    'data-sortorder': 'asc'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.score }).join(',')
  })
  var desc = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'score',
    'data-sortorder': 'desc'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.score }).join(',')
  })

  assertEqual(asc, '1,2,10')
  assertEqual(desc, '10,2,1')
})

test('data-sortorder - sorts nested properties and root arrays', function () {
  if (!app.module.data) return

  var nestedSource = {
    data: { items: [{ meta: { name: 'Zeta' } }, { meta: { name: 'Alpha' } }] },
    status: 200
  }
  var nested = runSortorder(nestedSource, {
    'data-iterate': 'items',
    'data-sort': 'meta.name',
    'data-sortorder': 'asc'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.meta.name }).join(',')
  })

  var root = runSortorder({
    data: [{ title: 'Zeta' }, { title: 'Alpha' }],
    status: 200
  }, {
    'data-iterate': 'true',
    'data-sort': 'title',
    'data-sortorder': 'desc'
  }, 'true', function (response) {
    return response.data.map(function (item) { return item.title }).join(',')
  })

  assertEqual(nested, 'Alpha,Zeta')
  assertEqual(root, 'Zeta,Alpha')
})

test('data-sortorder - supports collection-prefixed paths in nested iterates', function () {
  if (!app.module.data) return

  var mockData = {
    locations: [{ id: 'site-1' }],
    location_evidence: [
      { location_id: 'site-1', title: 'Alpha' },
      { location_id: 'site-1', title: 'Zeta' },
      { location_id: 'site-2', title: 'Other' }
    ]
  }
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://sortorder-prefixed')
  parent.setAttribute('data-filterkey', 'locations')
  parent.setAttribute('data-filteritem', "id:'site-1'")
  parent.innerHTML = '<div data-filterkey="location_evidence" data-filteritem="location_id:\'site-1\'" data-iterate="location_evidence" data-sort="location_evidence.title" data-sortorder="desc"><span data-get="title"></span></div>'
  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(parent.querySelector('[data-iterate]'))

  app.module.data._run({ storageKey: 'sortorder-prefixed', iterate: undefined, element: parent }, { data: mockData, status: 200 })

  var spans = parent.querySelectorAll('[data-iterate] span')
  assertEqual(spans.length, 2)
  assertEqual(spans[0].textContent, 'Zeta')
  assertEqual(spans[1].textContent, 'Alpha')
})

test('data-sortorder - defaults to ascending when omitted or unsupported', function () {
  if (!app.module.data) return

  var source = { data: { items: [{ title: 'Zeta' }, { title: 'Alpha' }] }, status: 200 }
  var omitted = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'title'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.title }).join(',')
  })
  var unsupported = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'title',
    'data-sortorder': 'invalid'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.title }).join(',')
  })

  assertEqual(omitted, 'Alpha,Zeta')
  assertEqual(unsupported, 'Alpha,Zeta')
})

test('data-sortorder - filters before sorting', function () {
  if (!app.module.data) return

  var source = {
    data: {
      items: [
        { country: 'Syria', title: 'Zeta' },
        { country: 'Turkey', title: 'Aardvark' },
        { country: 'Syria', title: 'Alpha' }
      ]
    },
    status: 200
  }
  var rendered = runSortorder(source, {
    'data-filterkey': 'items',
    'data-filteritem': "country:'Syria'",
    'data-iterate': 'items',
    'data-sort': 'title',
    'data-sortorder': 'asc'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.title }).join(',')
  })

  assertEqual(rendered, 'Alpha,Zeta')
  assertEqual(source.data.items.length, 3)
})

test('data-sortorder - applies before limit and pagination', function () {
  if (!app.module.data) return

  var source = {
    data: {
      items: [
        { title: 'Delta' },
        { title: 'Alpha' },
        { title: 'Gamma' },
        { title: 'Beta' }
      ]
    },
    status: 200
  }
  var limited = runSortorder(source, {
    'data-iterate': 'items',
    'data-sort': 'title',
    'data-sortorder': 'desc',
    'data-limit': '2'
  }, 'items', function (response) {
    return response.data.items.map(function (item) { return item.title }).join(',')
  })
  var element = createElement('div')
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-sort', 'title')
  element.setAttribute('data-sortorder', 'desc')
  element.setAttribute('data-page', '2')
  element.setAttribute('data-pagesize', '2')
  app.element.saveOriginalValues(element)
  var rendered
  var originalTraverse = app.module.data._traverse
  app.module.data._traverse = function (options, response) {
    rendered = response.data.items.map(function (item) { return item.title }).join(',')
  }
  try {
    app.module.data._run({ storageKey: 'sortorder-page', iterate: 'items', element: element }, source)
  } finally {
    app.module.data._traverse = originalTraverse
  }

  assertEqual(limited, 'Gamma,Delta')
  assertEqual(rendered, 'Beta,Alpha')
  assertEqual(element._dataPaging.totalPages, 2)
  assertEqual(element._dataPaging.start, 3)
  assertEqual(element._dataPaging.end, 4)
})
