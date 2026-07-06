test('outlinecolor - should set outline-color', function () {
  var testElement = createElement('div')
  app.call('outlinecolor:#' + testElement.id + ':red')
  assertEqual(testElement.style.outlineColor, 'red')
})
