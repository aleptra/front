test('app.element.extractBracketValues - single bracket', function () {
  var result = app.element.extractBracketValues('[value]')
  assertEqual(result, 'value')
})

test('app.element.extractBracketValues - multiple brackets', function () {
  var result = app.element.extractBracketValues('[one][two][three]')
  assertEqual(result.length, 3).desc('count values')
  assertEqual(result[0], 'one').desc('value 1')
  assertEqual(result[1], 'two').desc('value 2')
  assertEqual(result[2], 'three').desc('value 3')
})

test('app.element.extractBracketValues - special char &', function () {
  var result = app.element.extractBracketValues('[&test]')
  assertEqual(result, '&test')
})

test('app.element.extractBracketValues - empty brackets', function () {
  var result = app.element.extractBracketValues('[]')
  assertEqual(result, '')
})

test('app.element.extractBracketValues - no brackets', function () {
  var result = app.element.extractBracketValues('no brackets here')
  assertEqual(result, '')
})