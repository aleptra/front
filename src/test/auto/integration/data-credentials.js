test('data-credentials - enables credentials only for the literal true value', function () {
  var data = app.module.data
  var enabled = createElement('div')
  var request

  enabled.setAttribute('data-src', '/credentials-on.json')
  enabled.setAttribute('data-credentials', 'true')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(enabled)
    })
  })

  assertTrue(request.credentials)

  var disabled = createElement('div')
  disabled.setAttribute('data-src', '/credentials-off.json')
  disabled.setAttribute('data-credentials', 'false')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(disabled)
    })
  })

  assertFalse(request.credentials)
})
