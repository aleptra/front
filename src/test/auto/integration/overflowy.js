test('overflowy - should set overflow-y', function () {
  var expected = 'auto'
  var testElement = createElement('div')
  app.call('overflowy:#' + testElement.id + ':[auto]')
  assertStyleEqual(testElement, 'overflow-y', expected)
})
