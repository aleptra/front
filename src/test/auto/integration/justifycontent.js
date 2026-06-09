test('justifycontent - should set justify-content property', function () {
  var expected = 'center'
  var testElement = createElement('div')
  app.call('justifycontent:#' + testElement.id + ':[center]')
  assertStyleEqual(testElement, 'justifyContent', expected)
})