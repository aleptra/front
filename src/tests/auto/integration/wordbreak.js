test('wordbreak - should set word-break style to break-all', function () {
  var expected = 'break-all'
  var testElement = createElement('div')
  app.call('wordbreak:#' + testElement.id + ':[break-all]')
  assertStyleEqual(testElement, 'wordBreak', expected)
})