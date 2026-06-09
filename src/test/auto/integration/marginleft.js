test('marginleft - should set left margin', function () {
  var expected = '15px'
  var testElement = createElement('div')
  app.call('marginleft:#' + testElement.id + ':[15px]')
  assertStyleEqual(testElement, 'marginLeft', expected)
})