test('margin - should set margin', function () {
  var expected = '20px'
  var testElement = createElement('div')
  app.call('margin:#' + testElement.id + ':[20px]')
  assertStyleEqual(testElement, 'margin', expected)
})