test('grid - should set display to grid', function () {
  var expected = 'grid'
  var testElement = createElement('div')
  app.call('grid:#' + testElement.id)
  assertStyleEqual(testElement, 'display', expected)
})