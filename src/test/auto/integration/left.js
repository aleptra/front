test('left - should set left CSS property', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('left:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'left', expected)
})
