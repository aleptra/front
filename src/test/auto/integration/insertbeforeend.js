test('insertbeforeend - should insert text at the end of element', function () {
  var expected = 'Hello World'
  var testElement = createElement('div')
  testElement.textContent = 'Hello'
  app.call('insertbeforeend:#' + testElement.id + ':[ World]')
  assertEqual(testElement.textContent, expected)
})