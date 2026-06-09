test('minwidth - should set minimum width', function () {
  var expected = '100px'
  var testElement = createElement('div')
  app.call('minwidth:#' + testElement.id + ':[100px]')
  assertStyleEqual(testElement, 'minWidth', expected)
})