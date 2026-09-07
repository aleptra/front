test('table - should set display to table', function () {
  var expected = 'table'
  var testElement = createElement('div')
  app.call('table:#' + testElement.id)
  assertStyleEqual(testElement, 'display', expected)
})
