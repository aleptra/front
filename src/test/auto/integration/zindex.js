test('zindex - should set z-index of the element', function () {
  var expected = '10'
  var testElement = createElement('div')
  app.call('zindex:#' + testElement.id + ':[10]')
  assertStyleEqual(testElement, 'zIndex', expected)
})