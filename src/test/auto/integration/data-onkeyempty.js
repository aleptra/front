test('data-onkeyempty - runs the callback when a nested key resolves to nothing', function () {
  if (!app.module.data) return

  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onkeyempty')
  element.innerHTML =
    '<ul data-iterate="absent" data-onkeyempty="settext:#' + target.id + ':[Nothing here]">' +
    '<li data-get="title"></li></ul>'

  app.element.saveOriginalValues(element)
  app.element.saveOriginalValues(element.querySelector('ul'))

  app.module.data._run(
    { storageKey: 'data-onkeyempty-key', iterate: undefined, element: element },
    { data: { items: [{ title: 'Present' }] }, status: 200 }
  )

  assertEqual(target.textContent, 'Nothing here')
})

test('data-onkeyempty - stays silent when the nested key has items', function () {
  if (!app.module.data) return

  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-src', 'mock://data-onkeyempty-filled')
  element.innerHTML =
    '<ul data-iterate="items" data-onkeyempty="settext:#' + target.id + ':[Nothing here]">' +
    '<li data-get="title"></li></ul>'

  app.element.saveOriginalValues(element)
  app.element.saveOriginalValues(element.querySelector('ul'))

  app.module.data._run(
    { storageKey: 'data-onkeyempty-filled-key', iterate: undefined, element: element },
    { data: { items: [{ title: 'Present' }] }, status: 200 }
  )

  assertEqual(target.textContent, 'Waiting')
  assertEqual(element.querySelector('ul li').textContent, 'Present')
})
