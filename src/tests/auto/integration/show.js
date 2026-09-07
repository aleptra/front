test('show - should make hidden element visible', function () {
  var testElement = createElement('div')
  testElement.initDisplay = 'block'

  app.call('show:#' + testElement.id)
  assertStyleEqual(testElement, 'display', 'block')
})