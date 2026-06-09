test('trim - should remove whitespaces from element content', function () {
  var expected = 'trim'
  var testElement = createElement('div')
  testElement.innerText = ' ' + expected + ' '
  app.call('trim:#' + testElement.id + ':[ ]')
  assertEqual(testElement.innerText, expected)
})