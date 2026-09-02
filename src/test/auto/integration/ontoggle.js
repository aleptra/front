test('ontoggle - dispatches the normalized element function with its value', function () {
  var element = createElement('div')
  var captured

  element.setAttribute('ontoggle', 'set[Toggled]')

  withStub(app, 'exec', function (run, args) {
    captured = { run: run, element: args.element, value: args.value }
  }, function () {
    dom.toggle({ exec: { func: 'toggledisplay', element: element } })
  })

  assertEqual(captured.run, 'app.element.set')
  assertEqual(captured.element, element)
  assertEqual(captured.value, 'Toggled')
})

test('ontoggle - is optional for the toggle action', function () {
  var element = createElement('div')
  var calls = 0

  withStub(app, 'exec', function () { calls++ }, function () {
    dom.toggle({ exec: { func: 'toggledisplay', element: element } })
  })

  assertEqual(calls, 0)
  assertContains(element.style.cssText, 'display: none')
})
