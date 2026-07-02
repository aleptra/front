test('inline - should set display to inline', function () {
  var expected = 'inline'
  var testElement = createElement('div')
  app.call('inline:#' + testElement.id)
  assertStyleEqual(testElement, 'display', expected)
})
