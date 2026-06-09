test('flexitem - should set flex property on the element', function () {
  var expected = '1 1 auto'
  var testElement = createElement('div')
  app.call('flexitem:#' + testElement.id + ':[1 1 auto]')
  assertStyleEqual(testElement, 'flex', expected)
})