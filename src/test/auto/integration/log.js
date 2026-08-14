test('log - should forward the value to console.log', function () {
  var logged
  var originalLog = console.log
  console.log = function (value) { logged = value }

  dom.log(null, 'logged value')

  console.log = originalLog
  assertEqual(logged, 'logged value')
})
