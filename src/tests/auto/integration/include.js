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

test('include - should execute descendant attributes after an asynchronous response', function () {
  var element = createElement('div')
  var originalXHR = window.XMLHttpRequest

  function FakeXHR() {
    this.statusType = { success: true }
  }
  FakeXHR.prototype.open = function () { }
  FakeXHR.prototype.setRequestHeader = function () { }
  FakeXHR.prototype.send = function () {
    this.responseText = '<span settext="loaded"></span>'
    this.onload()
  }

  window.XMLHttpRequest = FakeXHR
  element.setAttribute('include', 'fragment.html')
  dom.include(element)
  window.XMLHttpRequest = originalXHR

  assertEqual(element.querySelector('span').textContent, 'loaded')
})
