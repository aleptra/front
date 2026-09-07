test('insertafterend - should insert text after element', function () {
  var expected = 'Hello World'
  var testElement = createElement('div')
  testElement.textContent = 'Hello'
  app.call('insertafterend:#' + testElement.id + ':[ World]')
  assertEqual(testElement.textContent + testElement.nextSibling.textContent, expected)
})