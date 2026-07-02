test('overflowx - should set overflow-x', function () {
  var expected = 'scroll'
  var testElement = createElement('div')
  app.call('overflowx:#' + testElement.id + ':[scroll]')
  assertStyleEqual(testElement, 'overflow-x', expected)
})
