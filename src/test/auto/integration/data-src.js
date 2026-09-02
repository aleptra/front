test('data-src - schedules a source request through data-src', function () {
  var handled
  var data = app.module.data
  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(data, '_handle', function (element) { handled = element }, function () {
      var element = createElement('div')
      element.setAttribute('data-src', '/items.json')
      element.setAttribute('data-wait', '0')
      app.call('rerun', { element: element })
      assertEqual(handled, element)
    })
  })
})

test('data-rerun - uses the cached response without requesting data-src', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var cached = { data: { items: ['cached'] }, status: 200 }
  var received
  var sourceCalls = 0

  element.setAttribute('data-src', 'mock://data-rerun-cache')

  withStub(app.caches, 'get', function () { return cached }, function () {
    withStub(data, '_run', function (options, cache) {
      received = { options: options, cache: cache }
    }, function () {
      withStub(data, 'src', function () { sourceCalls++ }, function () {
        app.call('data-rerun', { element: element })
      })
    })
  })

  assertEqual(received.options.element, element)
  assertEqual(received.cache, cached)
  assertEqual(sourceCalls, 0)
})
