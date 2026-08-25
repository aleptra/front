test('data-sort - random ordering works with pagesize one and refreshes', function () {
  if (!app.module.data) return

  var data = app.module.data,
    source = { data: { items: [{ id: 'one' }, { id: 'two' }, { id: 'three' }] }, status: 200 },
    element = createElement('div'),
    selected = [],
    originalTraverse = data._traverse,
    originalRandom = Math.random

  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-sort', 'random')
  element.setAttribute('data-pagesize', '1')
  app.element.saveOriginalValues(element)
  data._traverse = function (options, response) {
    selected.push(response.data.items[0].id)
  }

  try {
    Math.random = function () { return 0 }
    data._run({ storageKey: 'sort-random-refresh', iterate: 'items', element: element }, source)
    Math.random = function () { return 0.999 }
    data._run({ storageKey: 'sort-random-refresh', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
    Math.random = originalRandom
  }

  assertEqual(selected.length, 2)
  assertTrue(selected[0] !== selected[1])
  assertEqual(element._dataPaging.totalItems, 3)
  assertEqual(element._dataPaging.totalPages, 3)
  assertTrue(element._dataPaging.hasNext)
})

test('data-sort - random ordering runs after filtering and before limit', function () {
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
    rendered,
    originalTraverse = data._traverse,
    originalRandom = Math.random

  element.setAttribute('data-filterkey', 'items')
  element.setAttribute('data-filteritem', "country:'Syria'")
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-sort', 'random')
  element.setAttribute('data-limit', '1')
  app.element.saveOriginalValues(element)
  data._traverse = function (options, response) {
    rendered = response.data.items
  }

  try {
    Math.random = function () { return 0.999 }
    data._run({ storageKey: 'sort-random-filter-limit', iterate: 'items', element: element }, source)
  } finally {
    data._traverse = originalTraverse
    Math.random = originalRandom
  }

  assertEqual(rendered.length, 1)
  assertEqual(rendered[0].country, 'Syria')
  assertEqual(source.data.items.length, 3)
})

test('data-sort - leaves non-array collections unchanged', function () {
  if (!app.module.data) return

  var data = app.module.data,
    object = { title: 'single' },
    response = { data: { item: object }, status: 200 },
    result = data._transformCollection(response, 'item', 'title', 'desc', null, null, null)

  assertEqual(result.data.item, object)
  assertEqual(result.data.item.title, 'single')
  assertEqual(data._sort([], 'title', 'asc').length, 0)
})
