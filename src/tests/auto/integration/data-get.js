test('data-get - writes resolved values into matching elements', function () {
  if (!app.module.data) return

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
  if (!app.module.data) return

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
