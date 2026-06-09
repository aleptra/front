test('border - should set border style', function () {
  var expected = '2px solid rgb(255, 0, 0)'
  var testElement = createElement('div')
  app.call('border:#' + testElement.id + ':[2px solid red]')
  assertStyleEqual(testElement, 'border', expected)
})