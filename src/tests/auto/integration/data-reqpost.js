test('data-reqpost - forwards a post request through data-reqpost', function () {
  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    var element = createElement('button')
    element.setAttribute('data-reqpost', '/api/items')
    element.setAttribute('data-header', 'Accept:application/json')
    element.setAttribute('click', 'data-reqpost')
    app.call(element.getAttribute('click'), { srcElement: element })
  })
  assertEqual(request.method, 'post')
  assertEqual(request.url, '/api/items')
})
