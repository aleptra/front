test('alignself - should set align-self', function () {
  var expected = 'flex-end'
  var testElement = createElement('div')
  app.call('alignself:#' + testElement.id + ':[flex-end]')
  assertStyleEqual(testElement, 'align-self', expected)
})
