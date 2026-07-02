test('gridrow - should set grid-row', function () {
  var expected = '1 / 2'
  var testElement = createElement('div')
  app.call('gridrow:#' + testElement.id + ':[1 / 2]')
  assertStyleEqual(testElement, 'grid-row', expected)
})
