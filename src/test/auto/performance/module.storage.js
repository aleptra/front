test('storage - parsing and pair extraction throughput', function () {
  var parts
  var pairs
  var elapsed = measure(function () {
    for (var i = 0; i < 5000; i++) {
      parts = app.module.storage._parseParts('profile:users[' + i + ']:name')
      pairs = app.module.storage._extractPairs('name[User ' + i + ']role[member]')
    }
  })

  assertEqual(parts[0], 'profile')
  assertEqual(parts[1], String(4999))
  assertEqual(parts[2], 'users')
  assertEqual(parts[3], 'name')
  assertEqual(pairs.length, 2)
  assertEqual(pairs[0].name, 'name')
  assertEqual(pairs[1].value, 'member')
  assertTrue(elapsed < 1000).desc('5000 storage parsing passes in ' + elapsed.toFixed(2) + 'ms')
})
