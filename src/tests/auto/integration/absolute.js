test('absolute - should set position to absolute', function () {
  var testElement = createElement('div')
  app.call('absolute:#' + testElement.id)
  assertStyleEqual(testElement, 'position', 'absolute')
})
