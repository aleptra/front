test('form-throttle - blocks repeated submits within the configured window', function () {
  var form = createElement('form')
  var waits = []

  form.setAttribute('form-throttle', '250')

  withStub(app, 'wait', function (ms) { waits.push(ms) }, function () {
    dispatchTestEvent(form, 'submit')
    assertTrue(form._formThrottled)
    assertEqual(waits.length, 1)
    assertEqual(waits[0], 250)

    // A second submit while throttled must not schedule another release.
    dispatchTestEvent(form, 'submit')
    assertTrue(form._formThrottled)
    assertEqual(waits.length, 1)
  })

  form._formThrottled = false
})

test('form-throttle - releases the form when the window elapses', function () {
  var form = createElement('form')
  var release

  form.setAttribute('form-throttle', '100')

  withStub(app, 'wait', function (ms, callback) { release = callback }, function () {
    dispatchTestEvent(form, 'submit')
    assertTrue(form._formThrottled)

    release()
    assertFalse(form._formThrottled)
  })
})

test('form-throttle - forms without the attribute are never throttled', function () {
  var form = createElement('form')
  var waits = 0

  withStub(app, 'wait', function () { waits++ }, function () {
    dispatchTestEvent(form, 'submit')
  })

  assertEqual(waits, 0)
  assertEqual(!!form._formThrottled, false)
})
