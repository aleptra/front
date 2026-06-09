test('height - should set element height', function () {
  var expected = '300px'
  var testElement = createElement('div')
  app.call('height:#' + testElement.id + ':[300px]')
  assertStyleEqual(testElement, 'height', expected)
})