test('escape - should escape a single character', function () {
  var expected = '&#65;'
  var testElement = createElement('div')
  testElement.innerText = 'A'
  app.call('escape:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})

test('escape - should escape an emoji character', function () {
  var expected = '&#128512;'
  var testElement = createElement('div')
  testElement.innerText = '😀'
  app.call('escape:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})

test('escape - should escape a special character', function () {
  var expected = '&#60;'
  var testElement = createElement('div')
  testElement.innerText = '<'
  app.call('escape:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})