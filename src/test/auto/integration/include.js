test('include - should prepare an asynchronous include request', function () {
  var element = createElement('div')
  element.setAttribute('include', 'fragment.html')
  var request
  var originalRequest = app.xhr.request
  app.xhr.request = function (options) { request = options }

  dom.include(element)

  app.xhr.request = originalRequest
  assertEqual(request.url, 'fragment.html')
  assertTrue(!!element.id)
})
