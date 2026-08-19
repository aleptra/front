test('blur - should blur the element', function () {
  var testElement = createElement('input')
  var blurred = false

  // Mock the blur method
  testElement.blur = function () { blurred = true }

  app.call('blur:#' + testElement.id)
  assertTrue(blurred)
})

test.skip('blur - should run the normalized blurred callback', function () {
  var target = createElement('div')
  var element = createElement('input')
  element.blur = function () { }
  element.setAttribute('onblurred', 'settext:#' + target.id + ':[blurred]')

  app.call('blur:#' + element.id)

  assertEqual(target.textContent, 'blurred')
})
