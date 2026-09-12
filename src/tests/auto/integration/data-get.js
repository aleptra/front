test('data-get - writes resolved values into matching elements', function () {
  var element = createElement('div')
  element.setAttribute('data-src', 'mock://data-get')
  element.innerHTML = '<span id="dataGetTitle" data-get="title"></span><em data-get="meta.author"></em>'
  app.element.saveOriginalValues(element)

  app.module.data._run(
    { storageKey: 'data-get-key', iterate: undefined, element: element },
    { data: { title: 'Attributes', meta: { author: 'Josef' } }, status: 200 }
  )

  assertEqual(element.querySelector('#dataGetTitle').textContent, 'Attributes')
  assertEqual(element.querySelector('em').textContent, 'Josef')
})

test('data-get - leaves the element empty for a missing path', function () {
  var element = createElement('div')
  element.setAttribute('data-src', 'mock://data-get-missing')
  element.innerHTML = '<span data-get="absent"></span>'
  app.element.saveOriginalValues(element)

  app.module.data._run(
    { storageKey: 'data-get-missing-key', iterate: undefined, element: element },
    { data: { title: 'Present' }, status: 200 }
  )

  assertEqual(element.querySelector('span').textContent, '')
})

test('data-get - resolves object iteration keys without stringifying records', function () {
  var element = createElement('div')
  element.setAttribute('data-iterate', 'true')
  element.innerHTML = '<b data-get="[*]"></b><small data-get="[*].key1"></small>'
  app.element.saveOriginalValues(element)

  app.module.data._traverse(
    { iterate: 'true', element: element },
    {
      data: {
        One: { key1: 'Value 1' },
        Two: { key1: 'Value 2' }
      },
      status: 200
    },
    element,
    '*:not([data-iterate-skip])'
  )

  var headings = element.querySelectorAll('b')
  var values = element.querySelectorAll('small')
  assertEqual(headings.length, 2)
  assertEqual(headings[0].textContent, 'One')
  assertEqual(headings[1].textContent, 'Two')
  assertEqual(values[0].textContent, 'Value 1')
  assertEqual(values[1].textContent, 'Value 2')
  assertEqual(element.textContent.indexOf('[object Object]'), -1)
})
