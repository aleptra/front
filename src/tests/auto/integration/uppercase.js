test('uppercase - should convert element content to uppercase', function () {
  var expected = 'UPPERCASE'
  var testElement = createElement('span')
  testElement.innerText = 'uppercase'

  app.call('uppercase:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})