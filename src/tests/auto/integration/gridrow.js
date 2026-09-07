test('gridrow - should set grid-row', function () {
  var expected = '1 / 2'
  var testElement = createElement('div')
  app.call('gridrow:#' + testElement.id + ':[1 / 2]')
  assertStyleEqual(testElement, 'grid-row', expected)
})

test('gridrow - should keep a bare line number unitless', function () {
  var expected = '2'
  var testElement = createElement('div')
  app.call('gridrow:#' + testElement.id + ':[2]')
  assertStyleEqual(testElement, 'grid-row', expected)
})
