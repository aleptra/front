test('data-ongetload - runs the callback after data-get resolves', function () {
  if (!app.module.data) return

  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-ongetload')
  element.innerHTML = '<span data-get="title" data-ongetload="settext:#' + target.id + ':[Loaded]"></span>'
  app.element.saveOriginalValues(element)

  app.module.data._run(
    { storageKey: 'data-ongetload-key', iterate: undefined, element: element },
    { data: { title: 'Attributes' }, status: 200 }
  )

  assertEqual(target.textContent, 'Loaded')
})
