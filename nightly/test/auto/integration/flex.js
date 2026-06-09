test('flex - should set display to flex', function () {
  var expected = 'flex'
  var testElement = createElement('div')
  app.call('flex:#' + testElement.id)
  assertStyleEqual(testElement, 'display', expected)
})