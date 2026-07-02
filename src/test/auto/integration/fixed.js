test('fixed - should set position to fixed', function () {
  var testElement = createElement('div')
  app.call('fixed:#' + testElement.id)
  assertStyleEqual(testElement, 'position', 'fixed')
})
