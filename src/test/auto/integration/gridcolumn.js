test('gridcolumn - should set grid-column', function () {
  var expected = '1 / 3'
  var testElement = createElement('div')
  app.call('gridcolumn:#' + testElement.id + ':[1 / 3]')
  assertStyleEqual(testElement, 'grid-column', expected)
})

test('gridcolumn - should keep a bare line number unitless', function () {
  var expected = '2'
  var testElement = createElement('div')
  app.call('gridcolumn:#' + testElement.id + ':[2]')
  assertStyleEqual(testElement, 'grid-column', expected)
})
