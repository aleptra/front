test('gridarea - should set grid-area', function () {
  var expected = 'header'
  var testElement = createElement('div')
  app.call('gridarea:#' + testElement.id + ':[header]')
  assertStyleEqual(testElement, 'grid-area', expected)
})

test('gridarea - should keep a bare line number unitless', function () {
  var expected = '2'
  var testElement = createElement('div')
  app.call('gridarea:#' + testElement.id + ':[2]')
  assertStyleEqual(testElement, 'grid-area', expected)
})
