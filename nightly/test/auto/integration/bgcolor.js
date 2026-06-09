test('bgcolor - should set background color of the element', function () {
  var expected = 'rgb(0, 128, 0)' // green
  var testElement = createElement('div')
  app.call('bgcolor:#' + testElement.id + ':[green]')
  assertStyleEqual(testElement, 'backgroundColor', expected)
})