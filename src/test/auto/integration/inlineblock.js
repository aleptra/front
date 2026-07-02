test('inlineblock - should set display to inline-block', function () {
  var expected = 'inline-block'
  var testElement = createElement('div')
  app.call('inlineblock:#' + testElement.id)
  assertStyleEqual(testElement, 'display', expected)
})
