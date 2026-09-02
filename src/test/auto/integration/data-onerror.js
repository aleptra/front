test('data-onerror - forwards the error actions to the request', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var request

  element.setAttribute('data-src', '/onerror-items.json')
  element.setAttribute('data-onerror', 'show:#errorPanel')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(element)
    })
  })

  assertEqual(request.error, 'show:#errorPanel')
})
