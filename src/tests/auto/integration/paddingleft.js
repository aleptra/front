test('paddingleft - should set left padding on element', function () {
  var expected = '15px'
  var testElement = createElement('div')
  app.call('paddingleft:#' + testElement.id + ':[15px]')
  assertStyleEqual(testElement, 'paddingLeft', expected)
})