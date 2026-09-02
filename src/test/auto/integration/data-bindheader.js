test('data-bindheader - binds a response header into a target element', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('span')
  var element = createElement('div')

  element.setAttribute('data-src', '/bindheader-items.json')
  element.setAttribute('data-bindheader', 'X-Total-Count:#' + target.id)
  app.element.saveOriginalValues(element)

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-bindheader-key', iterate: 'items', element: element },
      { data: { items: [] }, headers: { 'X-Total-Count': '42' }, status: 200 }
    )
  })

  assertEqual(app.element.get(target), '42')
})
