test('fontsize - should set font-size', function () {
  var expected = '20px'
  var testElement = createElement('div')
  app.call('fontsize:#' + testElement.id + ':[20px]')
  assertStyleEqual(testElement, 'font-size', expected)
})
