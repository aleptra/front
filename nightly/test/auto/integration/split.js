var content = 'abc/def/ghi'

test('split - should return first part when index is 0', function () {
  var expected = 'abc'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('split:#' + testElement.id + ':[/][0]')
  assertEqual(testElement.innerText, expected)
})

test('split - should return second part when index is 1', function () {
  var expected = 'def'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('split:#' + testElement.id + ':[/][1]')
  assertEqual(testElement.innerText, expected)
})

test('split - should return second part when index is 2', function () {
  var expected = 'ghi'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('split:#' + testElement.id + ':[/][2]')
  assertEqual(testElement.innerText, expected)
})

test('split - should handle negative index', function () {
  var expected = ''
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('split:#' + testElement.id + ':[/][-1]')
  assertEqual(testElement.innerText, expected)
})

test('split - should return full string if delimiter not found', function () {
  var expected = 'abc/def/ghi'
  var testElement = createElement('div')
  testElement.innerText = content
  app.call('split:#' + testElement.id + ':[x][0]')
  assertEqual(testElement.innerText, expected)
})