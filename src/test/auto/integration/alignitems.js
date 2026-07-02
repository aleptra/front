test('alignitems - should set align-items', function () {
  var expected = 'center'
  var testElement = createElement('div')
  app.call('alignitems:#' + testElement.id + ':[center]')
  assertStyleEqual(testElement, 'align-items', expected)
})
