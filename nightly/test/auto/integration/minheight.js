test('minheight - should set minimum height', function () {
  var expected = '100px'
  var testElement = createElement('div')
  app.call('minheight:#' + testElement.id + ':[100px]')
  assertStyleEqual(testElement, 'minHeight', expected)
})