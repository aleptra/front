test('gridarea - should set grid-area', function () {
  var expected = 'header'
  var testElement = createElement('div')
  app.call('gridarea:#' + testElement.id + ':[header]')
  assertStyleEqual(testElement, 'grid-area', expected)
})
