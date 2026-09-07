test('data-ttl - forwards the cache lifetime to the request', function () {
  var data = app.module.data
  var element = createElement('div')
  var request

  element.setAttribute('data-src', '/ttl-items.json')
  element.setAttribute('data-ttl', '3600')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(element)
    })
  })

  assertEqual(request.cache.ttl, '3600')
  assertEqual(request.cache.mechanism, data.storageMechanism)
  assertEqual(request.cache.keyType, data.storageType)
})

test('data-ttl - is absent from the request when not configured', function () {
  var data = app.module.data
  var element = createElement('div')
  var request

  element.setAttribute('data-src', '/ttl-missing.json')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(element)
    })
  })

  assertEqual(request.cache.ttl, undefined)
})
