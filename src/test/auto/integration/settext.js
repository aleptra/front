test('settext - should set text of element', function () {
  var expected = 'text'
  var testElement = createElement('div')
  app.call('settext:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.innerText, expected)
})

test('settext - should set empty text when value is empty', function () {
  var expected = ' '
  var testElement = createElement('div')
  testElement.innerText = 'initial'
  app.call('settext:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.innerText, expected)
})