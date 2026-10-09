test('app.element.runOnEvent - fires on* handlers with runonce flag', function (done) {
  var element = createElement('div')
  var callCount = 0

  // Set up an onchange handler
  element.setAttribute('onchange', 'log("handler fired")')
  // Initialize executed object
  element.executed = {}

  // Mock app.call to count invocations
  var originalCall = app.call
  app.call = function (call, exec) {
    callCount++
  }

  try {
    // First call with default (no runonce) - should fire
    app.element.runOnEvent({ exec: { func: 'change', element: element } })
    assertEqual(callCount, 1).desc('handler fires on first call with default (runonce is true)')

    // Second call with default - fires again (guard was reset after first call)
    app.element.runOnEvent({ exec: { func: 'change', element: element } })
    assertEqual(callCount, 2).desc('handler fires on second call (executed was reset after first call)')

    // Reset call count and executed
    callCount = 0
    element.executed = {}

    // Third call with runonce: false - should fire
    app.element.runOnEvent({ exec: { func: 'change', element: element, runonce: false } })
    assertEqual(callCount, 1).desc('handler fires on first call with runonce: false')

    // Fourth call with runonce: false - should fire again (guard not set)
    app.element.runOnEvent({ exec: { func: 'change', element: element, runonce: false } })
    assertEqual(callCount, 2).desc('handler fires on second call with runonce: false (no guard)')

  } finally {
    app.call = originalCall
    done()
  }
})

test('app.element.runOnEvent - ondata-get with runonce: false fires multiple times', function (done) {
  var element = createElement('div')
  var handlerCount = 0

  // Simulate a handler
  element.setAttribute('ondata-get', 'log("data received")')
  element.executed = {}

  var originalCall = app.call
  app.call = function (call, exec) {
    if (call && call.indexOf('log') !== -1) {
      handlerCount++
    }
  }

  try {
    // First call with runonce: false - fires
    app.element.runOnEvent({ exec: { func: 'data-get', element: element, runonce: false } })
    assertEqual(handlerCount, 1).desc('handler fires on first call with runonce: false')

    // Second call with runonce: false - also fires (no guard)
    app.element.runOnEvent({ exec: { func: 'data-get', element: element, runonce: false } })
    assertEqual(handlerCount, 2).desc('handler fires on second call with runonce: false')

    // Third call with runonce: false - also fires
    app.element.runOnEvent({ exec: { func: 'data-get', element: element, runonce: false } })
    assertEqual(handlerCount, 3).desc('handler fires on third call with runonce: false')

  } finally {
    app.call = originalCall
    done()
  }
})
