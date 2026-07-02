test('float - should set float', function () {
  var expected = 'left'
  var testElement = createElement('div')
  app.call('float:#' + testElement.id + ':[left]')
  assertStyleEqual(testElement, 'float', expected)
})
