test('radius - should set border radius of the element', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('radius:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'borderRadius', expected)
})