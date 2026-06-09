test('lineheight - should set line height', function () {
  var expected = '16px'
  var testElement = createElement('div')
  app.call('lineheight:#' + testElement.id + ':[1rem]')
  assertStyleEqual(testElement, 'lineHeight', expected)
})