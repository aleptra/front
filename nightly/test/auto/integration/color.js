test('color - should set text color of element to red', function () {
  var expected = 'rgb(255, 0, 0)'
  var testElement = createElement('div')
  app.call('color:#' + testElement.id + ':[red]')
  assertStyleEqual(testElement, 'color', expected)
})