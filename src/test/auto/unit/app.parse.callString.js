test('app.parse.callString - func with bracket value', function () {
  var result = app.parse.callString('myfunc:[hello]')
  assertEqual(result.func, 'myfunc')
  assertEqual(result.value, 'hello')
})

test('app.parse.callString - func with multiple bracket values', function () {
  var result = app.parse.callString('myfunc:[one][two][three]')
  assertEqual(result.func, 'myfunc')
  assertEqual(result.value.length, 3)
  assertEqual(result.value[0], 'one')
  assertEqual(result.value[2], 'three')
})

test('app.parse.callString - func with element selector', function () {
  var el = createElement('div')
  var result = app.parse.callString('myfunc:#' + el.id + ':[value]')
  assertEqual(result.func, 'myfunc')
  assertEqual(result.value, 'value')
  assertIsObject(result.element)
})

test('app.parse.callString - func with no value', function () {
  var el = createElement('div')
  el.textContent = 'content'
  var result = app.parse.callString('myfunc:#' + el.id)
  assertEqual(result.func, 'myfunc')
  assertEqual(result.value, 'content')
})

test('app.parse.callString - unique flag (!)', function () {
  var result = app.parse.callString('myfunc:!:[value]')
  assertEqual(result.func, 'myfunc')
  assertTrue(result.unique)
})

test('app.parse.callString - empty brackets', function () {
  var result = app.parse.callString('myfunc:[]')
  assertEqual(result.func, 'myfunc')
  assertFalse(result.value)
})

test('app.parse.callString - nested brackets preserved', function () {
  var result = app.parse.callString('myfunc:[[inner][value]]')
  assertEqual(result.func, 'myfunc')
  assertEqual(result.value, '[inner][value]')
})
