test('block - should set display to block', function () {
  var expected = 'block'
  var testElement = createElement('div')
  app.call('block:#' + testElement.id)
  assertStyleEqual(testElement, 'display', expected)
})
