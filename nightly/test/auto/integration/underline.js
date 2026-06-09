test('underline - should underline text in element', function () {
  var expected = 'underline'
  var testElement = createElement('div')
  app.call('underline:#' + testElement.id)
  assertStyleEqual(testElement, 'textDecorationLine', expected)
})