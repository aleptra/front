test('whitespace - should set white-space style to pre-wrap', function () {
  var expected = 'pre-wrap'
  var testElement = createElement('div')
  app.call('whitespace:#' + testElement.id + ':[pre-wrap]')
  assertStyleEqual(testElement, 'whiteSpace', expected)
})