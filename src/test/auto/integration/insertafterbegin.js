test('insertafterbegin - should insert text at the beginning of element', function () {
  var expected = 'Hello World'
  var testElement = createElement('div')
  testElement.textContent = 'World'
  app.call('insertafterbegin:#' + testElement.id + ':[Hello ]')
  assertEqual(testElement.textContent, expected)
})