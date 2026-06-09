test('marginright - should set right margin', function () {
  var expected = '25px'
  var testElement = createElement('div')
  app.call('marginright:#' + testElement.id + ':[25px]')
  assertStyleEqual(testElement, 'marginRight', expected)
})