test('top - should set top CSS property', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('top:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'top', expected)
})
