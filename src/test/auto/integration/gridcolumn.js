test('gridcolumn - should set grid-column', function () {
  var expected = '1 / 3'
  var testElement = createElement('div')
  app.call('gridcolumn:#' + testElement.id + ':[1 / 3]')
  assertStyleEqual(testElement, 'grid-column', expected)
})
