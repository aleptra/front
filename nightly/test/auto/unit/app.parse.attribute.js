test('app.parse.attribute - empty string', function () {
  var result = app.parse.attribute('')
  assertIsObject(result)
})

test('app.parse.attribute - single pair', function () {
  var result = app.parse.attribute('color:red')
  assertEqual(result.color, 'red').desc('key "color" maps to "red"')
  assertEqual(Object.keys(result).length, 1).desc('only one property')
})

test('app.parse.attribute - multiple pairs', function () {
  var result = app.parse.attribute('width:100;height:200;margin:0 auto')
  assertEqual(result.width, '100')
  assertEqual(result.height, '200')
  assertEqual(result.margin, '0 auto').desc('preserves spaces in value')
  assertEqual(Object.keys(result).length, 3)
})

test('app.parse.attribute - empty pair (;;)', function () {
  var result = app.parse.attribute('a:1;;b:2')
  assertEqual(Object.keys(result).length, 2).desc('count two items')
  assertEqual(result.a, '1').desc('first')
  assertEqual(result.b, '2').desc('second')
})

test('app.parse.attribute - colon in value', function () {
  var result = app.parse.attribute('content:"hello:world"')
  assertEqual(result.content, '"hello:world"').desc('colon inside value is preserved')
})