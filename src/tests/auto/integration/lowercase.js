test('lowercase - should convert element content to lowercase', function () {
  var expected = 'lowercase'
  var testElement = createElement('span')
  testElement.innerText = 'LOWERCASE'

  app.call('lowercase:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})