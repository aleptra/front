test('scroll - should use the requested position and behavior', function () {
  var element = createElement('div')
  var call
  element.scrollTo = function (options) { call = options }

  dom.scroll(element, '42', true)

  assertEqual(call.top, 42)
  assertEqual(call.behavior, 'smooth')
})
