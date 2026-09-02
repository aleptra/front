test('data-header - forwards custom headers to the source request', function () {
  var data = app.module.data
  var element = createElement('div')
  var request

  element.setAttribute('data-src', '/header-items.json')
  element.setAttribute('data-header', 'Accept:application/json;X-Api-Version:2')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(element)
    })
  })

  assertEqual(request.headers, 'Accept:application/json;X-Api-Version:2')
  assertEqual(request.url, '/header-items.json')
})
