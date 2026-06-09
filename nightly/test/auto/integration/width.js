test('width - should set element width', function () {
  var expected = '400px'
  var testElement = createElement('div')
  app.call('width:#' + testElement.id + ':[400px]')
  assertStyleEqual(testElement, 'width', expected)
})