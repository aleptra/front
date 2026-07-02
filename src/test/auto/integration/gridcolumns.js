test('gridcolumns - should set grid-template-columns', function () {
  var expected = '1fr 1fr'
  var testElement = createElement('div')
  app.call('gridcolumns:#' + testElement.id + ':[1fr 1fr]')
  assertStyleEqual(testElement, 'grid-template-columns', expected)
})
