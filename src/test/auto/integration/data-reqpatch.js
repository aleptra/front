test('data-reqpatch - forwards a patch request through data-reqpatch', function () {
  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    var element = createElement('button')
    element.setAttribute('data-reqpatch', '/api/items/1')
    element.setAttribute('click', 'data-reqpatch')
    app.call(element.getAttribute('click'), { srcElement: element })
  })
  assertEqual(request.method, 'patch')
  assertEqual(request.url, '/api/items/1')
})
