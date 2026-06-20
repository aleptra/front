test('app.querystrings.get - extracts param from URL', function () {
  var result = app.querystrings.get('http://example.com?name=Front', 'name')
  assertEqual(result, 'Front')
})

test('app.querystrings.get - extracts second param', function () {
  var result = app.querystrings.get('http://example.com?a=1&b=2', 'b')
  assertEqual(result, '2')
})

test('app.querystrings.get - returns empty for missing param', function () {
  var result = app.querystrings.get('http://example.com?a=1', 'missing')
  assertEqual(result, '')
})

test('app.querystrings.get - handles encoded values', function () {
  var result = app.querystrings.get('http://example.com?q=hello%20world', 'q')
  assertEqual(result, 'hello world')
})

test('app.querystrings.get - empty value param', function () {
  var result = app.querystrings.get('http://example.com?key=', 'key')
  assertEqual(result, '')
})

test('app.querystrings.get - no query string returns empty', function () {
  var result = app.querystrings.get('http://example.com', 'anything')
  assertEqual(result, '')
})
