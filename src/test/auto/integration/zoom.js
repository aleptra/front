test('zoom - should set zoom level', function () {
  var expected = '1.5'
  var testElement = createElement('div')
  app.call('zoom:#' + testElement.id + ':[1.5]')
  assertStyleEqual(testElement, 'zoom', expected)
})


test('zoom - should keep a bare number unitless', function () {
  var expected = '2'
  var testElement = createElement('div')
  app.call('zoom:#' + testElement.id + ':[2]')
  assertStyleEqual(testElement, 'zoom', expected)
})
