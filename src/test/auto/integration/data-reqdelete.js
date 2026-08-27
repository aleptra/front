test('data-reqdelete - forwards a delete request through data-reqdelete', function () {
  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    var element = createElement('button')
    element.setAttribute('data-reqdelete', '/api/items/1')
    element.setAttribute('click', 'data-reqdelete')
    app.call(element.getAttribute('click'), { srcElement: element })
  })
  assertEqual(request.method, 'delete')
  assertEqual(request.url, '/api/items/1')
})
