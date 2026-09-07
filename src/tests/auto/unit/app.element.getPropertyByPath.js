test('app.element.getPropertyByPath - simple property', function () {
  var obj = { name: 'Front' }
  var result = app.element.getPropertyByPath(obj, 'name')
  assertEqual(result, 'Front')
})

test('app.element.getPropertyByPath - nested property', function () {
  var obj = { user: { profile: { name: 'Josef' } } }
  var result = app.element.getPropertyByPath(obj, 'user.profile.name')
  assertEqual(result, 'Josef')
})

test('app.element.getPropertyByPath - array index', function () {
  var obj = { items: ['a', 'b', 'c'] }
  var result = app.element.getPropertyByPath(obj, 'items.1')
  assertEqual(result, 'b')
})

test('app.element.getPropertyByPath - missing path returns empty', function () {
  var obj = { name: 'Front' }
  var result = app.element.getPropertyByPath(obj, 'missing.path')
  assertEqual(result, '')
})

test('app.element.getPropertyByPath - null object returns empty', function () {
  var result = app.element.getPropertyByPath(null, 'name')
  assertEqual(result, '')
})

test('app.element.getPropertyByPath - empty path returns object', function () {
  var obj = { name: 'Front' }
  var result = app.element.getPropertyByPath(obj, '')
  assertEqual(result, obj)
})

test('app.element.getPropertyByPath - numeric value', function () {
  var obj = { count: 42 }
  var result = app.element.getPropertyByPath(obj, 'count')
  assertEqual(result, 42)
})

test('app.element.getPropertyByPath - boolean value', function () {
  var obj = { active: true }
  var result = app.element.getPropertyByPath(obj, 'active')
  assertTrue(result)
})
