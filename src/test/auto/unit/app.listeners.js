test('app.listeners - adds, dispatches, removes, and preserves event detail', function () {
  var name = 'front-coverage-event'
  var received = null
  var callback = function (event) { received = event.detail }

  app.listeners.add(window, name, callback)
  app.listeners.dispatch(name, { value: 42 })
  app.listeners.remove(window, name, callback)

  assertEqual(received.value, 42).desc('custom event detail received')
})
