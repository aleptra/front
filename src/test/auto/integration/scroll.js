test('scroll - should use the requested position and behavior', function () {
  var element = createElement('div')
  var call
  element.scrollTo = function (options) { call = options }

  dom.scroll(element, '42', true)

  assertEqual(call.top, 42)
  assertEqual(call.behavior, 'smooth')
})

test('scroll - should resolve main and scroll to top and bottom', function () {
  var main = document.querySelector('main'),
    calls = [],
    originalScrollTo = main.scrollTo,
    scrollHeight = main.scrollHeight

  main.scrollTo = function (options) { calls.push(options) }

  try {
    app.call('scroll:*main:[top]')
    app.call('scroll:*main:[bottom]')
  } finally {
    if (originalScrollTo) main.scrollTo = originalScrollTo
    else delete main.scrollTo
  }

  assertEqual(calls.length, 2)
  assertEqual(calls[0].top, 0)
  assertEqual(calls[0].behavior, 'instant')
  assertEqual(calls[1].top, scrollHeight)
  assertEqual(calls[1].behavior, 'instant')
})
