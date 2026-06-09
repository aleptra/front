var content = 'slice'

test('slice - should slice element content from index 1', function () {
  var expected = 's'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[0,1]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should slice element content from index 2', function () {
  var expected = 'sl'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[0,2]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should slice element content from index 3', function () {
  var expected = 'ce'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[3]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should slice element content from index 4', function () {
  var expected = 'e'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[4]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should return full string when slicing from index 0', function () {
  var expected = 'slice'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[0]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should return substring from range start to end', function () {
  var expected = 'li'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[1,3]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should return full string when range matches full length', function () {
  var expected = 'slice'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[0,5]')
  assertEqual(testElement.innerText, expected)
})

test('slice - should return empty string when index is out of bounds', function () {
  var expected = ''
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('slice:#' + testElement.id + ':[10]')
  assertEqual(testElement.innerText, expected)
})