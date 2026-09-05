test('underline - should underline text in element', function () {
  var expected = 'underline'
  var testElement = createElement('div')
  app.call('underline:#' + testElement.id)
  assertStyleEqual(testElement, 'textDecorationLine', expected)
})

test('underline - should position the underline under the text', function () {
  var testElement = createElement('div')
  app.call('underline:#' + testElement.id)
  assertEqual(testElement.style.textDecoration, 'underline')
  assertEqual(testElement.style.textUnderlinePosition, 'under')
})

test('underline - should work as an attribute', function () {
  var testElement = createElement('div')
  testElement.setAttribute('underline', '')
  app.attributes.run([testElement])
  assertEqual(testElement.style.textDecoration, 'underline')
  assertEqual(testElement.style.textUnderlinePosition, 'under')
})
