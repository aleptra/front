test('overflow - should set overflow', function () {
  var expected = 'hidden'
  var testElement = createElement('div')
  app.call('overflow:#' + testElement.id + ':[hidden]')
  assertStyleEqual(testElement, 'overflow', expected)
})
