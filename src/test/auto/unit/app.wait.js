test('app.wait - schedules frames until the requested duration elapses', function () {
  var frames = [0, 5, 15]
  var frameCalls = 0
  var completed = false

  withProperty(window, 'requestAnimationFrame', function (callback) {
    frameCalls++
    callback(frames.shift())
  }, function () {
    app.wait(10, function () {
      completed = true
    })
  })

  assertTrue(completed).desc('wait callback executed')
  assertEqual(frameCalls, 3).desc('wait requested the expected frames')
})
