test('sethref - should set href attribute of element', function () {
  var expected = 'https://example.com'
  var testElement = createElement('a')
  app.call('sethref:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.getAttribute('href'), expected)
})