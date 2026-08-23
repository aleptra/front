test('data-iterate - nested iterate="true" inside single-mode parent should receive full array', function () {
  // Mock response: array of 3 items
  var mockData = [
    { id: '1', lang_code: 'eng', word: 'Hello' },
    { id: '2', lang_code: 'swe', word: 'Hej' },
    { id: '3', lang_code: 'syc', word: 'Shlomo' }
  ]

  // Create parent section (single mode, no data-iterate)
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://test')

  // Create nested child with data-iterate="true"
  var child = document.createElement('div')
  child.setAttribute('data-iterate', 'true')
  child.innerHTML = '<p data-get="word"></p>'
  parent.appendChild(child)

  // Save original values as attributes.run would
  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(child)

  // Simulate what data module does: call _traverse with single-mode parent
  var responseData = { data: mockData, status: 200 }
  var options = {
    iterate: undefined, // parent has no data-iterate
    element: parent
  }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // The child should have 3 <p> elements with the words populated
  var words = child.querySelectorAll('p')
  assertEqual(words.length, 3)
  assertEqual(words[0].textContent, 'Hello')
  assertEqual(words[1].textContent, 'Hej')
  assertEqual(words[2].textContent, 'Shlomo')
})

test('data-iterate - nested iterate="true" should not break when parent iterates too', function () {
  // Mock response: array of 2 items, each with a sub-array
  var mockData = [
    { name: 'Group A', items: [{ word: 'one' }, { word: 'two' }] },
    { name: 'Group B', items: [{ word: 'three' }] }
  ]

  // Create parent with data-iterate="true"
  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h6 data-get="name"></h6><ul data-iterate="items"><li data-get="word"></li></ul>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = {
    iterate: 'true',
    element: parent
  }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // Parent should have 2 h6 elements
  var headings = parent.querySelectorAll('h6')
  assertEqual(headings.length, 2)
  assertEqual(headings[0].textContent, 'Group A')
  assertEqual(headings[1].textContent, 'Group B')
})


test('data-iterate - should iterate over a named key in the response', function () {
  // Response is an object with a named array key
  var mockData = {
    extensions: [
      { name: 'navigate' },
      { name: 'data' },
      { name: 'screen' }
    ]
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'extensions')
  parent.innerHTML = '<span data-get="name"></span>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'extensions', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var spans = parent.querySelectorAll('span')
  assertEqual(spans.length, 3)
  assertEqual(spans[0].textContent, 'navigate')
  assertEqual(spans[1].textContent, 'data')
  assertEqual(spans[2].textContent, 'screen')
})

test('data-iterate - should iterate over a nested key path (multi-level)', function () {
  // Response has a deeply nested array
  var mockData = {
    result: {
      items: [
        { title: 'First' },
        { title: 'Second' }
      ]
    }
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'result.items')
  parent.innerHTML = '<p data-get="title"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'result.items', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 2)
  assertEqual(paragraphs[0].textContent, 'First')
  assertEqual(paragraphs[1].textContent, 'Second')
})


test('data-iterate - nested iterate inside iterate should render sub-items', function () {
  if (!app.module.data) return

  // Parent array with nested arrays
  var mockData = [
    { category: 'Fruits', items: [{ name: 'Apple' }, { name: 'Banana' }] },
    { category: 'Vegetables', items: [{ name: 'Carrot' }, { name: 'Pea' }, { name: 'Onion' }] }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h4 data-get="category"></h4><ul data-iterate="items"><li data-get="name"></li></ul>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // Should have 2 categories
  var headings = parent.querySelectorAll('h4')
  assertEqual(headings.length, 2)
  assertEqual(headings[0].textContent, 'Fruits')
  assertEqual(headings[1].textContent, 'Vegetables')

  // Should have 2 <ul> lists
  var lists = parent.querySelectorAll('ul')
  assertEqual(lists.length, 2)

  // First list: 2 items
  var firstItems = lists[0].querySelectorAll('li')
  assertEqual(firstItems.length, 2)
  assertEqual(firstItems[0].textContent, 'Apple')
  assertEqual(firstItems[1].textContent, 'Banana')

  // Second list: 3 items
  var secondItems = lists[1].querySelectorAll('li')
  assertEqual(secondItems.length, 3)
  assertEqual(secondItems[0].textContent, 'Carrot')
  assertEqual(secondItems[1].textContent, 'Pea')
  assertEqual(secondItems[2].textContent, 'Onion')
})

test('data-iterate - three levels deep nested iterate', function () {
  if (!app.module.data) return

  var mockData = [
    {
      department: 'Engineering',
      teams: [
        { team: 'Frontend', members: [{ name: 'Alice' }, { name: 'Bob' }] },
        { team: 'Backend', members: [{ name: 'Carol' }] }
      ]
    }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h3 data-get="department"></h3>' +
    '<div data-iterate="teams">' +
    '<h5 data-get="team"></h5>' +
    '<ul data-iterate="members"><li data-get="name"></li></ul>' +
    '</div>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // 1 department
  var departments = parent.querySelectorAll('h3')
  assertEqual(departments.length, 1)
  assertEqual(departments[0].textContent, 'Engineering')

  // 2 teams
  var teams = parent.querySelectorAll('h5')
  assertEqual(teams.length, 2)
  assertEqual(teams[0].textContent, 'Frontend')
  assertEqual(teams[1].textContent, 'Backend')

  // 3 total members across both teams
  var members = parent.querySelectorAll('li')
  assertEqual(members.length, 3)
  assertEqual(members[0].textContent, 'Alice')
  assertEqual(members[1].textContent, 'Bob')
  assertEqual(members[2].textContent, 'Carol')
})


test('data-iterate - empty array should produce no iterations', function () {
  if (!app.module.data) return

  var mockData = []

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<p data-get="word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 0)
})

test('data-iterate - single item array should produce one iteration', function () {
  if (!app.module.data) return

  var mockData = [{ word: 'Solo' }]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<p data-get="word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 1)
  assertEqual(paragraphs[0].textContent, 'Solo')
})

test('data-iterate - data-set should resolve variable into attribute', function () {
  if (!app.module.data) return

  var mockData = [
    { id: '42', label: 'Click me' },
    { id: '99', label: 'Submit' }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<a data-set="myid:id" data-get="label" href="page.html?id={myid}"></a>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var links = parent.querySelectorAll('a')
  assertEqual(links.length, 2)
  assertEqual(links[0].textContent, 'Click me')
  assertEqual(links[0].getAttribute('href'), 'page.html?id=42')
  assertEqual(links[1].textContent, 'Submit')
  assertEqual(links[1].getAttribute('href'), 'page.html?id=99')
})

test('data-iterate - iterate over object keys', function () {
  if (!app.module.data) return

  // Response is a plain object (not array) — iterates over keys
  var mockData = {
    eng: { word: 'Hello' },
    swe: { word: 'Hej' }
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<p data-get="[*].word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 2)
  assertEqual(paragraphs[0].textContent, 'Hello')
  assertEqual(paragraphs[1].textContent, 'Hej')
})

test('data-iterate - multiple elements per iteration block', function () {
  if (!app.module.data) return

  var mockData = [
    { title: 'Post 1', author: 'Alice' },
    { title: 'Post 2', author: 'Bob' }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h3 data-get="title"></h3><small data-get="author"></small>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var titles = parent.querySelectorAll('h3')
  var authors = parent.querySelectorAll('small')
  assertEqual(titles.length, 2)
  assertEqual(authors.length, 2)
  assertEqual(titles[0].textContent, 'Post 1')
  assertEqual(authors[0].textContent, 'Alice')
  assertEqual(titles[1].textContent, 'Post 2')
  assertEqual(authors[1].textContent, 'Bob')
})

test('data-iterate - data-get with dot-path accesses nested property', function () {
  if (!app.module.data) return

  var mockData = [
    { meta: { score: '95' } },
    { meta: { score: '82' } }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<span data-get="meta.score"></span>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var spans = parent.querySelectorAll('span')
  assertEqual(spans.length, 2)
  assertEqual(spans[0].textContent, '95')
  assertEqual(spans[1].textContent, '82')
})

test('data-iterate - data-iterate-skip elements should be preserved', function () {
  if (!app.module.data) return

  var mockData = [{ word: 'One' }, { word: 'Two' }]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h2 data-iterate-skip>Header</h2><p data-get="word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // The h2 with data-iterate-skip should appear once at the top
  var headers = parent.querySelectorAll('h2')
  assertEqual(headers.length, 1)
  assertEqual(headers[0].textContent, 'Header')

  // The iterated content should have 2 paragraphs
  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 2)
  assertEqual(paragraphs[0].textContent, 'One')
  assertEqual(paragraphs[1].textContent, 'Two')
})

test('data-iterate - data-set to external element by id', function () {
  if (!app.module.data) return

  var mockData = [
    { lang_code: 'eng', word: 'Jesus' },
    { lang_code: 'swe', word: 'Jesus' }
  ]

  // External target element
  var target = createElement('h1')
  target.id = 'ext_target'

  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://test')
  parent.setAttribute('data-set', '(lang_code%eng).word:#' + target.id)

  // Nested iterate
  var child = document.createElement('div')
  child.setAttribute('data-iterate', 'true')
  child.innerHTML = '<p data-get="word"></p>'
  parent.appendChild(child)

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(child)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: undefined, element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // External element should have the resolved value
  assertEqual(target.textContent, 'Jesus')

  // Iterated items should be populated
  var words = child.querySelectorAll('p')
  assertEqual(words.length, 2)
  assertEqual(words[0].textContent, 'Jesus')
  assertEqual(words[1].textContent, 'Jesus')
})

test('data-filter - nested child filters can share one named source array', function () {
  if (!app.module.data) return

  var mockData = {
    excavations: [
      { country: 'Syria', modern_name: 'Ebla' },
      { country: 'Syria', modern_name: 'Mari' },
      { country: 'Turkey', modern_name: 'Göbekli Tepe' }
    ]
  }

  var parent = createElement('details')
  parent.setAttribute('data-src', 'mock://archaeological-fieldwork')
  parent.innerHTML =
    '<ul data-filterkey="excavations" data-filteritem="country:\'Syria\'" data-iterate="excavations">' +
    '<li><span data-get="modern_name"></span></li>' +
    '</ul>' +
    '<ul data-filterkey="excavations" data-filteritem="country:\'Turkey\'" data-iterate="excavations">' +
    '<li><span data-get="modern_name"></span></li>' +
    '</ul>'

  app.element.saveOriginalValues(parent)
  var filterLists = parent.querySelectorAll('ul')
  for (var i = 0; i < filterLists.length; i++) app.element.saveOriginalValues(filterLists[i])

  app.module.data._traverse(
    { iterate: undefined, element: parent },
    { data: mockData, status: 200 },
    parent,
    '*:not([data-iterate-skip])'
  )

  var lists = parent.querySelectorAll('ul'),
    syriaItems = lists[0].querySelectorAll('li'),
    turkeyItems = lists[1].querySelectorAll('li')

  assertEqual(lists.length, 2)
  assertEqual(syriaItems.length, 2)
  assertEqual(syriaItems[0].textContent, 'Ebla')
  assertEqual(syriaItems[1].textContent, 'Mari')
  assertEqual(turkeyItems.length, 1)
  assertEqual(turkeyItems[0].textContent, 'Göbekli Tepe')
})

test('data-iterate - nested child can use a root collection without data-src', function () {
  if (!app.module.data) return

  var mockData = {
    locations: [
      { id: 'site-1', name: 'Example site' }
    ],
    location_evidence: [
      { location_id: 'site-1', title: 'Inscribed tablet' },
      { location_id: 'site-2', title: 'Unrelated evidence' }
    ]
  }

  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://archaeology-root-context')
  parent.setAttribute('data-filterkey', 'locations')
  parent.setAttribute('data-filteritem', "id:'site-1'")
  parent.innerHTML =
    '<h1 data-get="name"></h1>' +
    '<div data-filterkey="location_evidence" data-filteritem="location_id:\'site-1\'" data-iterate="location_evidence">' +
    '<span data-get="title"></span>' +
    '</div>'

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(parent.querySelector('[data-iterate]'))

  app.module.data._run(
    { storageKey: 'mock-root-context', iterate: undefined, element: parent },
    { data: mockData, status: 200 }
  )

  var evidence = parent.querySelector('[data-iterate]')
  assertEqual(parent.querySelector('h1').textContent, 'Example site')
  assertEqual(evidence.querySelectorAll('span').length, 1)
  assertEqual(evidence.querySelector('span').textContent, 'Inscribed tablet')
})

test('data-filter - nested child filters handle single and empty matches', function () {
  if (!app.module.data) return

  var parent = createElement('details')
  parent.setAttribute('data-src', 'mock://archaeological-fieldwork-single-empty')
  parent.innerHTML =
    '<ul data-filterkey="excavations" data-filteritem="country:\'Syria\'" data-iterate="excavations">' +
    '<li><span data-get="modern_name"></span></li>' +
    '</ul>' +
    '<ul data-filterkey="excavations" data-filteritem="country:\'Egypt\'" data-iterate="excavations">' +
    '<li><span data-get="modern_name"></span></li>' +
    '</ul>'

  app.element.saveOriginalValues(parent)
  var filterLists = parent.querySelectorAll('ul')
  for (var i = 0; i < filterLists.length; i++) app.element.saveOriginalValues(filterLists[i])

  app.module.data._traverse(
    { iterate: undefined, element: parent },
    { data: { excavations: [{ country: 'Syria', modern_name: 'Ugarit' }] }, status: 200 },
    parent,
    '*:not([data-iterate-skip])'
  )

  var lists = parent.querySelectorAll('ul')
  assertEqual(lists[0].querySelectorAll('li').length, 1)
  assertEqual(lists[0].querySelector('li').textContent, 'Ugarit')
  assertEqual(lists[1].querySelectorAll('li').length, 0)
})

test('data-sort - random data with pagesize one refreshes from cache', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [{ id: 'one' }, { id: 'two' }, { id: 'three' }]
      },
      status: 200
    },
    element = createElement('div'),
    selected = [],
    originalTraverse = data._traverse,
    originalRandom = Math.random

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-sort', 'random')
  element.setAttribute('data-pagesize', '1')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    selected.push(response.data.items.map(function (item) { return item.id }))
  }

  try {
    Math.random = function () { return 0 }
    data._run({ storageKey: 'random-pagesize-refresh', iterate: 'items', element: element }, source)

    Math.random = function () { return 0.999 }
    data._run({ storageKey: 'random-pagesize-refresh', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
    Math.random = originalRandom
  }

  assertEqual(selected.length, 2)
  assertEqual(selected[0].length, 1)
  assertEqual(selected[1].length, 1)
  assertEqual(element._dataPaging.pageSize, 1)
  assertEqual(element._dataPaging.totalItems, 3)
  assertEqual(element._dataPaging.totalPages, 3)
  assertTrue(element._dataPaging.hasNext)
  assertTrue(selected[0][0] !== selected[1][0])
  assertEqual(source.data.items.length, 3)
  assertEqual(source.data.items[0].id, 'one')
  assertEqual(source.data.items[1].id, 'two')
  assertEqual(source.data.items[2].id, 'three')
})

test('data-sort - random data with pagesize one runs after filtering', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [
          { id: 'syria-1', country: 'Syria' },
          { id: 'turkey-1', country: 'Turkey' },
          { id: 'syria-2', country: 'Syria' }
        ]
      },
      status: 200
    },
    element = createElement('div'),
    filteredResult,
    originalTraverse = data._traverse,
    originalRandom = Math.random

  element.setAttribute('data-filterkey', 'items')
  element.setAttribute('data-filteritem', "country:'Syria'")
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-sort', 'random')
  element.setAttribute('data-pagesize', '1')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    filteredResult = response.data.items
  }

  try {
    Math.random = function () { return 0.999 }
    data._run({ storageKey: 'random-pagesize-filter', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
    Math.random = originalRandom
  }

  assertEqual(filteredResult.length, 1)
  assertEqual(filteredResult[0].country, 'Syria')
  assertEqual(source.data.items.length, 3)
})

test('data-page - renders the requested page and publishes metadata', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [
          { id: 1, title: 'One' },
          { id: 2, title: 'Two' },
          { id: 3, title: 'Three' },
          { id: 4, title: 'Four' },
          { id: 5, title: 'Five' }
        ]
      },
      status: 200
    },
    element = createElement('div'),
    rendered,
    originalTraverse = data._traverse

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-page', '2')
  element.setAttribute('data-pagesize', '2')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    rendered = response
  }

  try {
    data._run({ storageKey: 'paging-page-two', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(rendered.data.items.length, 2)
  assertEqual(rendered.data.items[0].title, 'Three')
  assertEqual(rendered.data.items[1].title, 'Four')
  assertEqual(element._dataPaging.page, 2)
  assertEqual(element._dataPaging.pageSize, 2)
  assertEqual(element._dataPaging.totalItems, 5)
  assertEqual(element._dataPaging.totalPages, 3)
  assertTrue(element._dataPaging.hasPrevious)
  assertTrue(element._dataPaging.hasNext)
  assertEqual(element._dataPaging.start, 3)
  assertEqual(element._dataPaging.end, 4)
})

test('data-page - named arrays are paged without mutating cached data', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        records: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
      },
      status: 200
    },
    element = createElement('div'),
    pages = [],
    originalTraverse = data._traverse

  element.setAttribute('data-iterate', 'records')
  element.setAttribute('data-pagesize', '2')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    pages.push(response.data.records.map(function (record) { return record.id }))
  }

  try {
    element.setAttribute('data-page', '2')
    data._run({ storageKey: 'paging-named-array', iterate: 'records', element: element }, source)
    element.setAttribute('data-page', '1')
    data._run({ storageKey: 'paging-named-array', iterate: 'records', element: element }, source)
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(pages[0].join(','), 'c,d')
  assertEqual(pages[1].join(','), 'a,b')
  assertEqual(source.data.records.length, 4)
  assertEqual(source.data.records[0].id, 'a')
  assertEqual(source.data.records[3].id, 'd')
})

test('data-page - navigation helpers rerender pages and stop at boundaries', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      },
      status: 200
    },
    element = createElement('div'),
    renderedPages = [],
    reruns = 0,
    originalTraverse = data._traverse,
    originalRerun = data._rerun

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-page', '1')
  element.setAttribute('data-pagesize', '2')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    renderedPages.push(response.data.items.map(function (item) { return item.id }).join(','))
  }
  data._rerun = function (target) {
    reruns++
    return this._run({ storageKey: 'paging-navigation', iterate: 'items', element: target }, source)
  }

  try {
    data._run({ storageKey: 'paging-navigation', iterate: 'items', element: element }, source)
    var rerunsAtFirstPage = reruns
    data.previous(element)
    data.next(element)
    data.next(element)
    var rerunsAtLastPage = reruns
    data.next(element)
    data.previous(element)
    data['goto']({ exec: { element: element, value: [3] } })
    data.goTo(element, 99)
  } finally {
    data._traverse = originalTraverse
    data._rerun = originalRerun
  }

  assertEqual(renderedPages.join('|'), '1,2|3,4|5|3,4|5|5')
  assertEqual(rerunsAtFirstPage, 0)
  assertEqual(rerunsAtLastPage, 2)
  assertEqual(element._dataPaging.page, 3)
  assertTrue(!element._dataPaging.hasNext)
  assertTrue(element._dataPaging.hasPrevious)
})

test('data-limit - caps a named collection without mutating the source', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [{ id: 'one' }, { id: 'two' }, { id: 'three' }]
      },
      status: 200
    },
    element = createElement('div'),
    limitedItems,
    originalTraverse = data._traverse

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-limit', '2')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    limitedItems = response.data.items
  }

  try {
    data._run({ storageKey: 'limit-cap', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(limitedItems.length, 2)
  assertEqual(limitedItems[0].id, 'one')
  assertEqual(limitedItems[1].id, 'two')
  assertEqual(source.data.items.length, 3)
  assertEqual(source.data.items[2].id, 'three')
})

test('data-sort - random ordering is applied before data-limit', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [{ id: 'one' }, { id: 'two' }, { id: 'three' }]
      },
      status: 200
    },
    element = createElement('div'),
    selectedItems,
    originalTraverse = data._traverse,
    originalRandom = Math.random

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-sort', 'random')
  element.setAttribute('data-limit', '2')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    selectedItems = response.data.items
  }

  try {
    Math.random = function () { return 0 }
    data._run({ storageKey: 'random-limit-order', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
    Math.random = originalRandom
  }

  assertEqual(selectedItems.length, 2)
  assertEqual(selectedItems[0].id, 'two')
  assertEqual(selectedItems[1].id, 'three')
  assertEqual(source.data.items.length, 3)
  assertEqual(source.data.items[0].id, 'one')
  assertEqual(source.data.items[1].id, 'two')
  assertEqual(source.data.items[2].id, 'three')
})

test('data-page - supports pagesize 1 and 4', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 }
        ]
      },
      status: 200
    },
    element = createElement('div'),
    rendered = [],
    originalTraverse = data._traverse

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-page', '1')
  app.element.saveOriginalValues(element)

  data._traverse = function (options, response) {
    rendered.push({
      ids: response.data.items.map(function (item) { return item.id }),
      paging: {
        pageSize: element._dataPaging.pageSize,
        totalPages: element._dataPaging.totalPages,
        start: element._dataPaging.start,
        end: element._dataPaging.end
      }
    })
  }

  try {
    element.setAttribute('data-pagesize', '1')
    data._run({ storageKey: 'paging-size-one', iterate: 'items', element: element }, source)

    element.setAttribute('data-pagesize', '4')
    data._run({ storageKey: 'paging-size-four', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(rendered[0].ids.join(','), '1')
  assertEqual(rendered[0].paging.pageSize, 1)
  assertEqual(rendered[0].paging.totalPages, 5)
  assertEqual(rendered[0].paging.start, 1)
  assertEqual(rendered[0].paging.end, 1)
  assertEqual(rendered[1].ids.join(','), '1,2,3,4')
  assertEqual(rendered[1].paging.pageSize, 4)
  assertEqual(rendered[1].paging.totalPages, 2)
  assertEqual(rendered[1].paging.start, 1)
  assertEqual(rendered[1].paging.end, 4)
  assertEqual(source.data.items.length, 5)
})

test('data-page - boundary events update declarative navigation controls', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = {
      data: {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }]
      },
      status: 200
    },
    paging = createElement('div'),
    previous = createElement('button'),
    next = createElement('button'),
    originalTraverse = data._traverse,
    originalRerun = data._rerun

  paging.setAttribute('data-iterate', 'items')
  paging.setAttribute('data-page', '1')
  paging.setAttribute('data-pagesize', '2')
  previous.setAttribute('click', 'data-previous:#' + paging.id)
  previous.setAttribute('ondata-firstpage', 'disabled')
  previous.setAttribute('ondata-notfirstpage', 'enabled')
  next.setAttribute('click', 'data-next:#' + paging.id)
  next.setAttribute('ondata-lastpage', 'disabled')
  next.setAttribute('ondata-notlastpage', 'enabled')
  app.element.saveOriginalValues(paging)
  app.element.saveOriginalValues(previous)
  app.element.saveOriginalValues(next)

  data._traverse = function (options) {
    this._finish(options)
  }
  data._rerun = function (element) {
    return this._run({ storageKey: 'paging-boundary-events', iterate: 'items', element: element }, source)
  }

  try {
    data._run({ storageKey: 'paging-boundary-events', iterate: 'items', element: paging }, source)
    assertTrue(previous.disabled)
    assertTrue(!next.disabled)
    data.next({ exec: { element: paging }, options: { srcElement: next } })

    assertEqual(paging._dataPaging.page, 2)
    assertTrue(!paging._dataPaging.hasNext)
    assertTrue(next.disabled)

    data.previous({ exec: { element: paging }, options: { srcElement: previous } })

    assertEqual(paging._dataPaging.page, 1)
    assertTrue(paging._dataPaging.hasNext)
    assertTrue(previous.disabled)
    assertTrue(!next.disabled)
  } finally {
    data._traverse = originalTraverse
    data._rerun = originalRerun
  }
})

test('data-iterate - root collection fallback supports sort and limit', function () {
  if (!app.module.data) return

  var mockData = {
    locations: [{ id: 'site-1' }],
    location_evidence: [
      { location_id: 'site-1', title: 'Zeta' },
      { location_id: 'site-1', title: 'Alpha' },
      { location_id: 'site-2', title: 'Other' }
    ]
  }
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://archaeology-root-sort-limit')
  parent.setAttribute('data-filterkey', 'locations')
  parent.setAttribute('data-filteritem', "id:'site-1'")
  parent.innerHTML = '<div data-filterkey="location_evidence" data-filteritem="location_id:\'site-1\'" data-iterate="location_evidence" data-sort="title" data-limit="1"><span data-get="title"></span></div>'

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(parent.querySelector('[data-iterate]'))
  app.module.data._run({ storageKey: 'mock-root-sort-limit', iterate: undefined, element: parent }, { data: mockData, status: 200 })

  var evidence = parent.querySelector('[data-iterate]')
  assertEqual(evidence.querySelectorAll('span').length, 1)
  assertEqual(evidence.querySelector('span').textContent, 'Alpha')
})

test('data-iterate - root collection fallback supports pagination', function () {
  if (!app.module.data) return

  var mockData = {
    locations: [{ id: 'site-1' }],
    location_evidence: [
      { location_id: 'site-1', title: 'First' },
      { location_id: 'site-1', title: 'Second' },
      { location_id: 'site-1', title: 'Third' }
    ]
  }
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://archaeology-root-pagination')
  parent.setAttribute('data-filterkey', 'locations')
  parent.setAttribute('data-filteritem', "id:'site-1'")
  parent.innerHTML = '<div data-filterkey="location_evidence" data-filteritem="location_id:\'site-1\'" data-iterate="location_evidence" data-page="2" data-pagesize="1"><span data-get="title"></span></div>'

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(parent.querySelector('[data-iterate]'))
  app.module.data._run({ storageKey: 'mock-root-pagination', iterate: undefined, element: parent }, { data: mockData, status: 200 })

  var evidence = parent.querySelector('[data-iterate]')
  assertEqual(evidence.querySelectorAll('span').length, 1)
  assertEqual(evidence.querySelector('span').textContent, 'Second')
  assertEqual(evidence._dataPaging.page, 2)
})

test('data-iterate - root collection fallback works through deeper nesting', function () {
  if (!app.module.data) return

  var mockData = {
    locations: [{ id: 'site-1' }],
    location_evidence: [{ id: 'evidence-1', location_id: 'site-1', title: 'Tablet' }],
    evidence_details: [{ evidence_id: 'evidence-1', text: 'Cuneiform inscription' }]
  }
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://archaeology-root-deep')
  parent.setAttribute('data-filterkey', 'locations')
  parent.setAttribute('data-filteritem', "id:'site-1'")
  parent.innerHTML =
    '<div data-filterkey="location_evidence" data-filteritem="location_id:\'site-1\'" data-iterate="location_evidence">' +
    '<span data-get="title"></span>' +
    '<section data-filterkey="evidence_details" data-filteritem="evidence_id:\'evidence-1\'" data-iterate="evidence_details"><span data-get="text"></span></section>' +
    '</div>'

  app.element.saveOriginalValues(parent)
  var iterates = parent.querySelectorAll('[data-iterate]')
  for (var i = 0; i < iterates.length; i++) app.element.saveOriginalValues(iterates[i])
  app.module.data._run({ storageKey: 'mock-root-deep', iterate: undefined, element: parent }, { data: mockData, status: 200 })

  var evidence = parent.querySelectorAll('[data-iterate]')[0]
  var details = parent.querySelectorAll('[data-iterate]')[1]
  assertEqual(evidence.querySelector('span').textContent, 'Tablet')
  assertEqual(details.querySelector('span').textContent, 'Cuneiform inscription')
})

test('data-iterate - local child collection takes precedence over root collection', function () {
  if (!app.module.data) return

  var mockData = {
    locations: [{
      id: 'site-1',
      location_evidence: [{ title: 'Nested evidence' }]
    }],
    location_evidence: [{ title: 'Root evidence' }]
  }
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://archaeology-local-precedence')
  parent.setAttribute('data-filterkey', 'locations')
  parent.setAttribute('data-filteritem', "id:'site-1'")
  parent.innerHTML = '<div data-filterkey="location_evidence" data-iterate="location_evidence"><span data-get="title"></span></div>'

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(parent.querySelector('[data-iterate]'))
  app.module.data._run({ storageKey: 'mock-local-precedence', iterate: undefined, element: parent }, { data: mockData, status: 200 })

  assertEqual(parent.querySelector('[data-iterate] span').textContent, 'Nested evidence')
})
