test('maxheight - should set max-height', function () {
  var expected = '200px'
  var testElement = createElement('div')
  app.call('maxheight:#' + testElement.id + ':[200px]')
  assertStyleEqual(testElement, 'max-height', expected)
})
