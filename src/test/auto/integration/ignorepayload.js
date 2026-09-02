test('ignorepayload - marked fields are left out of the request payload', function () {
  if (!app.module.data) return

  var form = createElement('form')
  var request

  // Forms send to their action, and an empty action stops the request.
  form.setAttribute('action', '/api/profile')
  form.setAttribute('data-reqpost', '/api/profile')
  form.innerHTML =
    '<input name="name" value="Ada">' +
    '<input name="secret" value="hidden" ignorepayload>'

  function FakeXHR() { this.headers = {} }
  FakeXHR.prototype.open = function (method, url) { this.method = method; this.url = url }
  FakeXHR.prototype.setRequestHeader = function (name, value) { this.headers[name] = value }
  FakeXHR.prototype.send = function (payload) { request = this; this.payload = payload }

  withProperty(window, 'XMLHttpRequest', FakeXHR, function () {
    app.module.data.reqpost({ exec: { element: form } })
  })

  var payload = JSON.parse(request.payload)
  assertEqual(payload.name, 'Ada')
  assertEqual(payload.secret, undefined)
})
