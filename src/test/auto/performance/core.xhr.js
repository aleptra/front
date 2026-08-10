test('core.xhr - request lifecycle and form payload throughput', function () {
  var OriginalXHR = window.XMLHttpRequest
  var requests = []
  var target = document.createElement('div')
  target.id = 'performance-xhr-target'
  document.body.appendChild(target)

  var form = document.createElement('form')
  form.innerHTML = '<input name="profile.name" value="Ada">' +
    '<input name="items[0]" value="one">' +
    '<input name="items[1]" value="two">'
  document.body.appendChild(form)

  function FakeXHR() {
    this.headers = {}
    requests.push(this)
  }

  FakeXHR.prototype.open = function (method, url, sync) {
    this.method = method
    this.url = url
    this.sync = sync
  }
  FakeXHR.prototype.setRequestHeader = function (name, value) {
    this.headers[name] = value
  }
  FakeXHR.prototype.send = function (payload) {
    this.payload = payload
    this.status = 200
    this.statusType = { success: true }
    this.responseText = 'OK'
    if (this.onload) this.onload()
  }
  FakeXHR.prototype.abort = function () {
    this.aborted = true
  }

  var elapsed
  try {
    window.XMLHttpRequest = FakeXHR
    elapsed = measure(function () {
      for (var i = 0; i < 100; i++) {
        app.xhr.request({
          url: '/performance-data',
          method: 'POST',
          srcEl: form,
          target: '#performance-xhr-target'
        })
      }
    })
  } finally {
    window.XMLHttpRequest = OriginalXHR
  }

  var payload = JSON.parse(requests[99].payload)
  assertEqual(requests.length, 100)
  assertEqual(requests[99].method, 'POST')
  assertEqual(payload.profile.name, 'Ada')
  assertEqual(payload.items, 'onetwo')
  assertEqual(target.innerHTML, 'OK')
  assertTrue(elapsed < 1000).desc('100 fake XHR requests in ' + elapsed.toFixed(2) + 'ms')

  target.parentNode.removeChild(target)
  form.parentNode.removeChild(form)
})
