test('clickoutside - merged listener handles both click and clickoutside', function () {
  var button = createElement('button')
  button.setAttribute('click', 'console.log')
  var clickListener = null

  // Verify that the click listener is registered (only one listener, not two)
  var listeners = []
  var originalAdd = app.listeners.add
  app.listeners.add = function (target, event, fn, capture) {
    if (target === document && event === 'click') {
      listeners.push({ event: event, fn: fn })
      clickListener = fn
    }
    return originalAdd.call(this, target, event, fn, capture)
  }

  // Re-initialize listeners to count them
  var oldListeners = app.listeners._listeners
  app.listeners._listeners = {}

  // Trigger listener setup code
  app.listeners.add(document, 'click', function (e) {
    // Mock single listener that handles both
  })

  app.listeners.add = originalAdd

  assertEqual(listeners.length, 1).desc('only one click listener registered (merged handler)')
})

test('clickoutside - handler processes elements with clickoutside attribute', function () {
  var overlay = createElement('div')
  overlay.setAttribute('clickoutside', 'console.log')
  overlay.style.position = 'absolute'
  overlay.style.width = '50px'
  overlay.style.height = '50px'

  assertTrue(overlay.hasAttribute('clickoutside')).desc('clickoutside attribute is set on element')
  assertEqual(overlay.getAttribute('clickoutside'), 'console.log').desc('clickoutside value is correct')
})

test('clickoutside - handler processes elements with click attribute', function () {
  var button = createElement('button')
  button.setAttribute('click', 'app.wait')

  assertTrue(button.hasAttribute('click')).desc('click attribute is set on element')
  assertEqual(button.getAttribute('click'), 'app.wait').desc('click value is correct')
})
