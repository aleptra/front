test('sticky - should set sticky position in element', function () {
  var testElement = createElement('div')
  app.call('sticky:#' + testElement.id)
  assertStyleEqual(testElement, 'position', 'sticky')
})
