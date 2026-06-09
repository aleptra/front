test('maxwidth - should set maximum width', function () {
  var expected = '500px'
  var testElement = createElement('div')
  app.call('maxwidth:#' + testElement.id + ':[500px]')
  assertStyleEqual(testElement, 'maxWidth', expected)
})