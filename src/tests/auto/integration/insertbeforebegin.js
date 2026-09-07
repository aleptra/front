test('insertbeforebegin - should insert text before element', function () {
  var expected = 'Hello World'
  var testElement = createElement('div')
  testElement.textContent = 'Hello'
  app.call('insertbeforebegin:#' + testElement.id + ':[ World]')
  assertEqual(testElement.textContent + testElement.previousSibling.textContent, expected)
})