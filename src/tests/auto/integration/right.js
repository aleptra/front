test('right - should set right CSS property', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('right:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'right', expected)
})
