test('trimleft - should remove left whitespaces from element content', function () {
  var expected = 'trim '
  var testElement = createElement('div')
  testElement.innerText = ' ' + expected
  app.call('trimleft:#' + testElement.id + ':[ ]')
  assertEqual(testElement.innerText, expected)
})