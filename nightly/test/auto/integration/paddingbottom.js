test('paddingbottom - should set bottom padding on element', function () {
  var expected = '25px'
  var testElement = createElement('div')
  app.call('paddingbottom:#' + testElement.id + ':[25px]')
  assertStyleEqual(testElement, 'paddingBottom', expected)
})