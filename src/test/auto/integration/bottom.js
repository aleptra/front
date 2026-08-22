test('bottom - should set bottom style property in element', function () {
  var testElement = createElement('div')
  app.call('bottom:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'bottom', '10px')
})
