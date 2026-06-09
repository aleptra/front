test('zoom - should set zoom level', function () {
  var expected = '1.5'
  var testElement = createElement('div')
  app.call('zoom:#' + testElement.id + ':[1.5]')
  assertStyleEqual(testElement, 'zoom', expected)
})