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

test('data-rerun - falls back to the source when no cache exists', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var requested
  var ranFromCache = 0

  element.setAttribute('data-src', 'mock://data-rerun-miss')
  element._dataSrc = 'mock://data-rerun-miss'

  withStub(app.caches, 'get', function () { return null }, function () {
    withStub(data, '_run', function () { ranFromCache++ }, function () {
      withStub(data, 'src', function (target) { requested = target }, function () {
        app.call('data-rerun', { element: element })
      })
    })
  })

  assertEqual(requested, element)
  assertEqual(ranFromCache, 0)
  // The guard against refetching the same URL must be cleared first.
  assertEqual(element._dataSrc, null)
})

test('data-rerun - does nothing without a data source', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var sourceCalls = 0
  var runCalls = 0

  withStub(data, '_run', function () { runCalls++ }, function () {
    withStub(data, 'src', function () { sourceCalls++ }, function () {
      app.call('data-rerun', { element: element })
    })
  })

  assertEqual(sourceCalls, 0)
  assertEqual(runCalls, 0)
})
