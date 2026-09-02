test('data-filterkey - selects the collection used by data-filter', function () {
  var data = app.module.data
  var element = createElement('div')
  var rendered
  var originalTraverse = data._traverse
  var source = {
    items: [
      { country: 'Turkey', title: 'Matched item' },
      { country: 'Syria', title: 'Excluded item' }
    ],
    other: [
      { country: 'Turkey', title: 'Wrong collection' }
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
    data._run({ storageKey: 'data-filterkey-test', iterate: 'items', element: element }, { data: source, status: 200 })
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(rendered.length, 1)
  assertEqual(rendered[0].title, 'Matched item')
  assertEqual(source.items.length, 2)
  assertEqual(source.other.length, 1)
})

test('data-filterkey - supports nested collection paths', function () {
  var data = app.module.data
  var source = {
    attribute: {
      interactive: [
        { since: 1000000, title: 'Matched item' },
        { since: 1100000, title: 'Excluded item' }
      ],
      content: [
        { since: 1000000, title: 'Other collection' }
      ]
    }
  }
  var filtered = data._filterExpression(source, 'since:[1000000]', 'attribute.interactive')

  assertEqual(filtered.data.attribute.interactive.length, 1)
  assertEqual(filtered.data.attribute.interactive[0].title, 'Matched item')
  assertEqual(filtered.data.attribute.content.length, 1)
  assertEqual(source.attribute.interactive.length, 2)
})
