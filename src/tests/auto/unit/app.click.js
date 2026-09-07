test('app.click - dispatches click and double-click events', function () {
  var target = createElement('button')
  var clicks = 0
  var doubleClicks = 0
  var onClick = function () { clicks++ }
  var onDoubleClick = function () { doubleClicks++ }

  app.listeners.add(target, 'click', onClick)
  app.listeners.add(target, 'dblclick', onDoubleClick)
  app.click(target)
  app.click(target, true)
  app.listeners.remove(target, 'click', onClick)
  app.listeners.remove(target, 'dblclick', onDoubleClick)

  assertEqual(clicks, 1).desc('click event dispatched')
  assertEqual(doubleClicks, 1).desc('double-click event dispatched')
})
