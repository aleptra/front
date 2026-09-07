test('data-onnotempty - runs the callback when the collection has items', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onnotempty')
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-onnotempty', 'settext:#' + target.id + ':[Has results]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onnotempty-key', iterate: 'items', element: element },
      { data: { items: ['Item'] }, status: 200 }
    )
  })

  assertEqual(target.textContent, 'Has results')
})

test('data-onnotempty - does not run for an empty collection', function () {
  if (!app.module.data) return

  var data = app.module.data
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onnotempty-empty')
  element.setAttribute('data-iterate', 'items')
  element.setAttribute('data-onnotempty', 'settext:#' + target.id + ':[Has results]')

  withStub(data, '_traverse', function () { }, function () {
    data._run(
      { storageKey: 'data-onnotempty-empty-key', iterate: 'items', element: element },
      { data: { items: [] }, status: 200 }
    )
  })

  assertEqual(target.textContent, 'Waiting')
})
