test('app.globals.get - frontVersion', function () {
  var result = app.globals.get('frontVersion')
  assertIsNumber(result.major).desc('major')
  assertIsNumber(result.minor).desc('minor')
  assertIsNumber(result.patch).desc('patch')
  assertIsNumber(result.build).desc('build')
})

test('app.globals.get - language', function () {
  var result = app.globals.get('language')
  assertIsString(result).desc('is a string')
  assertEqual(result, document.documentElement.lang || 'en').desc('matches document lang')
})

test('app.globals.get - docMode', function () {
  var result = app.globals.get('docMode')
  assertIsNumber(result).desc('is a number')
  assertEqual(result, document.documentMode || 0).desc('matches documentMode or 0')
})

test('app.globals.get - isFrontpage', function () {
  var result = app.globals.get('isFrontpage')
  assertEqual(result, document.doctype ? true : false).desc('matches doctype presence')

  app.globals.set('isFrontpage', false)
  assertFalse(app.globals.get('isFrontpage')).desc('updates to false via set')

  app.globals.set('isFrontpage', true)
  assertTrue(app.globals.get('isFrontpage')).desc('updates to true via set')

  app.globals.set('isFrontpage', result)
})

test('app.globals.get - href', function () {
  assertIsString(app.globals.get('href')).desc('is a string')
})

test('app.globals.get - title', function () {
  assertIsString(app.globals.get('title')).desc('is a string')
})

test('app.globals.get - windowHeight', function () {
  var expected = (window.visualViewport && window.visualViewport.height) || window.innerHeight
  assertIsNumber(app.globals.get('windowHeight')).desc('is a number')
  assertEqual(app.globals.get('windowHeight'), expected).desc('matches viewport height')
})

test('app.globals.get - windowWidth', function () {
  var expected = (window.visualViewport && window.visualViewport.width) || window.innerWidth
  assertIsNumber(app.globals.get('windowWidth')).desc('is a number')
  assertEqual(app.globals.get('windowWidth'), expected).desc('matches viewport width')
})

test('app.globals.get - unknown key returns undefined', function () {
  assertEqual(app.globals.get('nonExistentProperty'), undefined)
})

test('app.globals.get - set and get custom value', function () {
  app.globals.set('_testCustom', 'hello')
  assertEqual(app.globals.get('_testCustom'), 'hello')
  delete app.globals._testCustom
})
