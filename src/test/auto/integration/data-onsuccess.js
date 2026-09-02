test('data-onsuccess - runs the callback for a cached successful response', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onsuccess')
  element.setAttribute('data-onsuccess', 'settext:#' + target.id + ':[Loaded]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onsuccess-key', iterate: undefined, element: element },
      { data: { title: 'Attributes' }, status: 200 }
    )
  })

  assertEqual(target.textContent, 'Loaded')
})

test('data-onsuccess - does not run for a failed response', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onsuccess-failed')
  element.setAttribute('data-onsuccess', 'settext:#' + target.id + ':[Loaded]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onsuccess-failed-key', iterate: undefined, element: element },
      { data: {}, status: 500 }
    )
  })

  assertEqual(target.textContent, 'Waiting')
})
