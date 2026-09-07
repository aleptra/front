test('data-onstatus - runs the actions for a matching status code', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onstatus')
  element.setAttribute('data-onstatus', '(404)/settext:#' + target.id + ':[Not found]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onstatus-key', iterate: undefined, element: element },
      { data: {}, status: 404 }
    )
  })

  assertEqual(target.textContent, 'Not found')
})

test('data-onstatus - ignores a status that does not match', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onstatus-other')
  element.setAttribute('data-onstatus', '(404)/settext:#' + target.id + ':[Not found]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onstatus-other-key', iterate: undefined, element: element },
      { data: {}, status: 500 }
    )
  })

  assertEqual(target.textContent, 'Waiting')
})
