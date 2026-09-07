test('gridrows - should set grid-template-rows', function () {
  var expected = 'auto 1fr'
  var testElement = createElement('div')
  app.call('gridrows:#' + testElement.id + ':[auto 1fr]')
  assertStyleEqual(testElement, 'grid-template-rows', expected)
})
