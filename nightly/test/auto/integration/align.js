test('align - should set text alignment', function () {
  var testElement = createElement('div')
  testElement.style.display = 'block'

  app.call('align:#' + testElement.id + ':[center]')
  assertStyleEqual(testElement, 'textAlign', 'center')
})