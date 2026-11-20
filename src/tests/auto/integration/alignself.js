test('alignself - should set align-self', function () {
  var expected = ['flex-end', 'flow-end']
  var testElement = createElement('div')
  app.call('alignself:#' + testElement.id + ':[flex-end]')
  assertStyleEqualAny(testElement, 'align-self', expected)
})
