test('blur - should blur the element', function () {
  var testElement = createElement('input')
  var blurred = false

  // Mock the blur method
  testElement.blur = function () { blurred = true }

  app.call('blur:#' + testElement.id)
  assertTrue(blurred)
})
