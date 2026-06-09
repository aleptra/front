test('marginbottom - should set bottom margin', function () {
  var expected = '30px'
  var testElement = createElement('div')
  app.call('marginbottom:#' + testElement.id + ':[30px]')
  assertStyleEqual(testElement, 'marginBottom', expected)
})