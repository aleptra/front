test('padding - should set padding on element', function () {
  var expected = '20px'
  var testElement = createElement('div')
  app.call('padding:#' + testElement.id + ':[20px]')
  assertStyleEqual(testElement, 'padding', expected)
})