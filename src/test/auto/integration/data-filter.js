test('data-filter - supports bracket values and comparisons', function () {
  var source = {
    items: [
      { country: 'Turkey', age: 19 },
      { country: 'Turkey', age: 16 },
      { country: 'Syria', age: 25 }
    ]
  }
  var filtered = app.module.data._filterExpression(source, 'country:[Turkey]&&age>[18]', 'items')

  assertEqual(filtered.data.items.length, 1)
  assertEqual(filtered.data.items[0].country, 'Turkey')
  assertEqual(filtered.data.items[0].age, 19)
})

test('data-filter - supports OR, contains, and nested paths', function () {
  if (!app.module.data) return

  var source = {
    items: [
      { country: 'Turkey', meta: { region: 'Asia' } },
      { country: 'Syria', meta: { region: 'Asia' } },
      { country: 'Egypt', meta: { region: 'Africa' } }
    ]
  }
  var filtered = app.module.data._filterExpression(source, 'country:[Turkey]||meta.region~[Asia]', 'items')

  assertEqual(filtered.data.items.length, 2)
  assertEqual(filtered.data.items[0].country, 'Turkey')
  assertEqual(filtered.data.items[1].country, 'Syria')
})

test('data-filter - runs through data source filtering', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var rendered
  var originalTraverse = data._traverse
  var source = {
    items: [
      { country: 'Turkey', title: 'Matched' },
      { country: 'Syria', title: 'Excluded' }
    ]
  }

  element.setAttribute('data-filterkey', 'items')
  element.setAttribute('data-filter', 'country:[Turkey]')
  element.setAttribute('data-iterate', 'items')
  app.element.saveOriginalValues(element)
  data._traverse = function (options, response) {
    rendered = response.data.items
  }

  try {
    data._run({ storageKey: 'data-filter-expression', iterate: 'items', element: element }, { data: source, status: 200 })
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(rendered.length, 1)
  assertEqual(rendered[0].title, 'Matched')
  assertEqual(source.items.length, 2)
})

test('data-filter - filters nested iterate elements', function () {
  if (!app.module.data) return

  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://data-filter-nested')
  parent.innerHTML =
    '<ul data-filterkey="items" data-filter="country:[Turkey]" data-iterate="items">' +
    '<li><span data-get="title"></span></li>' +
    '</ul>'

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(parent.querySelector('[data-iterate]'))
  app.module.data._run(
    { storageKey: 'data-filter-nested', iterate: undefined, element: parent },
    {
      data: {
        items: [
          { country: 'Turkey', title: 'Matched' },
          { country: 'Syria', title: 'Excluded' }
        ]
      },
      status: 200
    }
  )

  var items = parent.querySelectorAll('li')
  assertEqual(items.length, 1)
  assertEqual(items[0].textContent, 'Matched')
})

test('data-filter - filters a nested iterate by its own numeric filter only', function () {
  if (!app.module.data) return

  var data = app.module.data
  var source = {
    attribute: {
      interactive: [
        { since: 999999, title: 'Too old' },
        { since: 1000000, title: 'Matched at boundary' },
        { since: 1000001, title: 'Matched newer' }
      ],
      content: [
        { since: 999999, title: 'Other collection' }
      ]
    }
  }
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://data-filter-nested-numeric')
  parent.innerHTML =
    '<table>' +
    '<tbody data-iterate="attribute.interactive" data-filter="since>:[1000000]">' +
    '<tr><td data-get="title"></td></tr>' +
    '</tbody>' +
    '<tbody data-iterate="attribute.content">' +
    '<tr><td data-get="title"></td></tr>' +
    '</tbody>' +
    '</table>'

  app.element.saveOriginalValues(parent)
  var iterates = parent.querySelectorAll('[data-iterate]')
  app.element.saveOriginalValues(iterates[0])
  app.element.saveOriginalValues(iterates[1])

  data._run(
    { storageKey: 'data-filter-nested-numeric', iterate: undefined, element: parent },
    { data: source, status: 200 }
  )

  var filtered = parent.querySelectorAll('tbody[data-iterate="attribute.interactive"] tr')
  assertEqual(filtered.length, 2)
  assertEqual(filtered[0].textContent, 'Matched at boundary')

  // A sibling collection without its own filter is left untouched.
  var untouched = parent.querySelectorAll('tbody[data-iterate="attribute.content"] tr')
  assertEqual(untouched.length, 1)
  assertEqual(untouched[0].textContent, 'Other collection')
  assertEqual(source.attribute.interactive.length, 3)
})

test('data-filter - uses >: for inclusive numeric filtering', function () {
  if (!app.module.data) return

  var source = {
    items: [
      { since: 999999 },
      { since: 1000000 },
      { since: 1000001 }
    ]
  }
  var inclusive = app.module.data._filterExpression(source, 'since>:[1000000]', 'items')
  var removed = app.module.data._filterExpression(source, 'since>=[1000000]', 'items')

  assertEqual(inclusive.data.items.length, 2)
  assertEqual(inclusive.data.items[0].since, 1000000)
  assertEqual(removed.data.items.length, 0)
})

test('data-filter - uses <: for inclusive numeric filtering', function () {
  if (!app.module.data) return

  var source = {
    items: [
      { since: 999999 },
      { since: 1000000 },
      { since: 1000001 }
    ]
  }
  var inclusive = app.module.data._filterExpression(source, 'since<:[1000000]', 'items')
  var removed = app.module.data._filterExpression(source, 'since<=[1000000]', 'items')

  assertEqual(inclusive.data.items.length, 2)
  assertEqual(inclusive.data.items[1].since, 1000000)
  assertEqual(removed.data.items.length, 0)
})
