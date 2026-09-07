test('onbindglobalchange - registers a live binding for the named attribute', function () {
  var element = createElement('i')

  element.setAttribute('bindglobal', 'href:href')
  element.setAttribute('if', '([{href}]~[/docs])/bold')
  element.setAttribute('onbindglobalchange', 'rerun:if')

  app.element.saveOriginalValues(element)
  element.executed = {}

  try {
    app.element.runOnEvent({ exec: { func: 'bindglobal', element: element } })

    assertTrue(!!element._live)
    assertEqual(element._live.attr, 'if')
    assertEqual(element._live.template, '([{href}]~[/docs])/bold')
    assertEqual(element._live.callPrefix, 'if:')
    assertTrue(app.globals._live.indexOf(element) !== -1)
  } finally {
    app.globals._live = app.globals._live.filter(function (el) { return el !== element })
  }
})

test('onbindglobalchange - no live binding is registered without the attribute', function () {
  var element = createElement('i')

  element.setAttribute('bindglobal', 'href:href')
  app.element.saveOriginalValues(element)
  element.executed = {}

  app.element.runOnEvent({ exec: { func: 'bindglobal', element: element } })

  assertEqual(element._live, null)
  assertEqual(app.globals._live.indexOf(element), -1)
})
