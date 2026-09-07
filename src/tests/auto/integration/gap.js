test('gap - should set gap', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('gap:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'gap', expected)
})
