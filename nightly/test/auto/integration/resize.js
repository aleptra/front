test('resize - should set resize property', function () {
  var testElement = createElement('textarea')
  app.call('resize:#' + testElement.id + ':[both]')
  assertStyleEqual(testElement, 'resize', 'both')
})