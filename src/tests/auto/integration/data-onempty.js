test('data-onempty - runs the callback when the collection has no items', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onempty')
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-onempty', 'settext:#' + target.id + ':[No results]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onempty-key', iterate: 'items', element: element },
      { data: { items: [] }, status: 200 }
    )
  })

  assertEqual(target.textContent, 'No results')
})

test('data-onempty - does not run when the collection has items', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onempty-filled')
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-onempty', 'settext:#' + target.id + ':[No results]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onempty-filled-key', iterate: 'items', element: element },
      { data: { items: ['Item'] }, status: 200 }
    )
  })

  assertEqual(target.textContent, 'Waiting')
})
