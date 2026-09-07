test('data-reqget - forwards a get request through data-reqget', function () {
  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    var element = createElement('button')
    element.setAttribute('data-reqget', '/api/items')
    element.setAttribute('click', 'data-reqget')
    app.call(element.getAttribute('click'), { srcElement: element })
  })
  assertEqual(request.method, 'get')
  assertEqual(request.url, '/api/items')
})
