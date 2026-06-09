test('bold - should make text bold in element content', function () {
  var expected = '700'
  var testElement = createElement('div')
  app.call('bold:#' + testElement.id)
  assertStyleEqual(testElement, 'fontWeight', expected)
})