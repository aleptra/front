test('app.parse.json - valid JSON object', function () {
  var result = app.parse.json('{"name":"Front","version":1}')
  assertEqual(result.value.name, 'Front')
  assertEqual(result.value.version, 1)
})

test('app.parse.json - valid JSON array', function () {
  var result = app.parse.json('[1,2,3]')
  assertEqual(result.value.length, 3)
  assertEqual(result.value[0], 1)
})

test('app.parse.json - valid JSON string', function () {
  var result = app.parse.json('"hello"')
  assertEqual(result.value, 'hello')
})

test('app.parse.json - invalid JSON returns error', function () {
  var result = app.parse.json('{invalid}')
  assertEqual(result.value, '')
  assertEqual(result.errorName, 'SyntaxError')
})

test('app.parse.json - empty string returns error', function () {
  var result = app.parse.json('')
  assertEqual(result.value, '')
  assertEqual(result.errorName, 'SyntaxError')
})

test('app.parse.json - null value in JSON', function () {
  var result = app.parse.json('{"key":null}')
  assertEqual(result.value.key, null)
})
