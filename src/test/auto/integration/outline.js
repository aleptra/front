test('outline - should set outline style', function () {
  var expected = '2px solid rgb(255, 0, 0)'
  var testElement = createElement('div')
  app.call('outline:#' + testElement.id + ':[2px solid red]')
  assertStyleEqual(testElement, 'outline', expected)
})
