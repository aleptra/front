test('data-filteritem - filters the selected collection with legacy syntax', function () {
  var data = app.module.data
  var element = createElement('div')
  var rendered
  var originalTraverse = data._traverse
  var source = {
    items: [
      { country: 'Turkey', active: true, title: 'Matched item' },
      { country: 'Turkey', active: false, title: 'Inactive item' },
      { country: 'Syria', active: true, title: 'Other country' }
    ],
    other: [
      { country: 'Turkey', active: true, title: 'Wrong collection' }
    ]
  }

  element.setAttribute('data-filterkey', 'items')
  element.setAttribute('data-filteritem', "country:'Turkey';active:true")
  element.setAttribute('data-iterate', 'items')
  app.element.saveOriginalValues(element)
  data._traverse = function (options, response) {
    rendered = response.data.items
  }

  try {
    data._run({ storageKey: 'data-filteritem-test', iterate: 'items', element: element }, { data: source, status: 200 })
  } finally {
    data._traverse = originalTraverse
  }

  assertEqual(rendered.length, 1)
  assertEqual(rendered[0].title, 'Matched item')
  assertEqual(source.items.length, 3)
  assertEqual(source.other.length, 1)
})

test('data-filteritem - nested iterates of a selected item are not re-filtered', function () {
  if (!app.module.data) return

  var section = createElement('section')
  section.setAttribute('data-src', 'mock://data-filteritem-nested')
  section.setAttribute('data-filterkey', 'workshop')
  section.setAttribute('data-filteritem', "key:'syntaxhighlighting'")
  section.innerHTML =
    '<ul data-iterate="instructions"><li data-get="[*]"></li></ul>' +
    '<div data-iterate="checks"><b data-get="label"></b></div>'

  app.element.saveOriginalValues(section)
  app.element.saveOriginalValues(section.querySelector('ul'))
  app.element.saveOriginalValues(section.querySelector('div'))

  app.module.data._run(
    { storageKey: 'data-filteritem-nested', iterate: undefined, element: section },
    {
      data: {
        workshop: [
          {
            key: 'syntaxhighlighting',
            instructions: ['Create a page', 'Add a heading'],
            checks: [{ label: 'Has doctype' }, { label: 'Has body' }, { label: 'Has h1' }]
          },
          { key: 'other', instructions: ['Ignored'], checks: [{ label: 'Ignored' }] }
        ]
      },
      status: 200
    }
  )

  assertEqual(section.querySelectorAll('ul li').length, 2)
  assertEqual(section.querySelector('ul li').textContent, 'Create a page')
  assertEqual(section.querySelectorAll('div b').length, 3)
  assertEqual(section.querySelector('div b').textContent, 'Has doctype')
})
