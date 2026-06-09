test('paddingright - should set right padding on element', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('paddingright:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'paddingRight', expected)
})