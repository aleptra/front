test('trimright - should remove right whitespaces from element content', function () {
  var expected = ' trim'
  var testElement = createElement('div')
  testElement.innerText = expected + ' '
  app.call('trimright:#' + testElement.id + ':[ ]')
  assertEqual(testElement.innerText, expected)
})