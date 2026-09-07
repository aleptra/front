test('data-set - replaces attribute variables with resolved values', function () {
  if (!app.module.data) return

  var element = createElement('div')
  element.setAttribute('data-src', 'mock://data-set')
  element.innerHTML = '<a data-set="d:slug" href="/attribute/?a={d}" title="{d}"></a>'
  app.element.saveOriginalValues(element)
  app.element.saveOriginalValues(element.querySelector('a'))

  app.module.data._run(
    { storageKey: 'data-set-key', iterate: undefined, element: element },
    { data: { slug: 'bgcolor' }, status: 200 }
  )

  var link = element.querySelector('a')
  assertEqual(link.getAttribute('href'), '/attribute/?a=bgcolor')
  assertEqual(link.getAttribute('title'), 'bgcolor')
})
