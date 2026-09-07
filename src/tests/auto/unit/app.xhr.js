test('app.xhr.request - returns early without a URL', function () {
  var originalXHR = window.XMLHttpRequest
  var created = false

  function FakeXHR() { created = true }
  withProperty(window, 'XMLHttpRequest', FakeXHR, function () {
    assertEqual(app.xhr.request({}), undefined).desc('empty request ignored')
  })
  assertFalse(created).desc('no XHR created')
  assertTrue(!!originalXHR).desc('browser XHR preserved')
})

test('app.xhr.request - sends GET headers, credentials, target content, and callbacks', function () {
  var requests = []
  var target = createElement('div')
  var successTarget = createElement('div')
  var before = createElement('div')
  var after = createElement('div')

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
    this.statusType = { success: true }
    this.responseText = 'response'
    this.onload()
  }
  FakeXHR.prototype.abort = function () { this.aborted = true }

  var oldExtension = app.fileExtension
  app.fileExtension = '.html'
  try {
    withProperty(window, 'XMLHttpRequest', FakeXHR, function () {
      app.xhr.request({
        url: '/coverage',
        target: '#' + target.id,
        headers: 'X-Test: yes',
        credentials: true,
        onload: { prepend: '<b>', append: '</b>' },
        beforesuccess: { name: 'before', value: 'settext:#' + before.id + ':[before]' },
        success: 'settext:#' + successTarget.id + ':[success]',
        aftersuccess: { name: 'after', originalValue: 'settext:#' + after.id + ':[after]', value: 'settext:#' + after.id + ':[after]' }
      })
    })
  } finally {
    app.fileExtension = oldExtension
  }

  assertEqual(requests.length, 1).desc('one request created')
  assertEqual(requests[0].method, 'GET').desc('default method is GET')
  assertEqual(requests[0].url, '/coverage.html').desc('file extension appended')
  assertEqual(requests[0].headers['X-Test'], 'yes').desc('custom header sent')
  assertEqual(requests[0].headers['Content-type'], 'application/x-www-form-urlencoded').desc('GET content type set')
  assertEqual(requests[0].withCredentials, true).desc('credentials enabled')
  assertEqual(target.innerHTML, '<b>response</b>').desc('response markup applied')
  assertEqual(successTarget.textContent, 'success').desc('success action applied')
  assertEqual(before.textContent, 'before').desc('before-success action applied')
  assertEqual(after.textContent, 'after').desc('after-success action applied')
})

test('app.xhr.request - builds nested POST payloads and skips ignored fields', function () {
  var request
  var form = createElement('form')
  form.innerHTML = '<input name="profile.name" value="Ada">' +
    '<input name="items[0]" value="one">' +
    '<input name="items[1]" value="two">' +
    '<input name="ignored" value="no" ignorepayload>' +
    '<input name="empty" value="">'

  function FakeXHR() { this.headers = {} }
  FakeXHR.prototype.open = function (method, url) {
    this.method = method
    this.url = url
  }
  FakeXHR.prototype.setRequestHeader = function (name, value) { this.headers[name] = value }
  FakeXHR.prototype.send = function (payload) {
    request = this
    this.payload = payload
  }

  withProperty(window, 'XMLHttpRequest', FakeXHR, function () {
    app.xhr.request({
      url: '/submit',
      method: 'POST',
      srcEl: form,
      enctype: 'application/custom+json'
    })
  })

  var payload = JSON.parse(request.payload)
  assertEqual(request.method, 'POST').desc('POST method used')
  assertEqual(payload.profile.name, 'Ada').desc('dot notation nested')
  assertEqual(payload.items, 'onetwo').desc('bracket group merged')
  assertEqual(payload.ignored, undefined).desc('ignored field omitted')
  assertEqual(request.headers['Content-type'], 'application/custom+json').desc('custom content type sent')
})

test('app.xhr.request - calls error and network-error actions and hides loader', function () {
  var serverError
  var networkError
  var loader = createElement('div')
  var serverTarget = createElement('div')
  var networkTarget = createElement('div')
  var mode = 'server'

  function FakeXHR() { this.headers = {} }
  FakeXHR.prototype.open = function () { }
  FakeXHR.prototype.setRequestHeader = function () { }
  FakeXHR.prototype.send = function () {
    if (mode === 'server') {
      this.statusType = { clientError: false, serverError: true }
      this.responseText = 'failed'
      this.onload()
    } else {
      this.onerror()
    }
  }

  withProperty(window, 'XMLHttpRequest', FakeXHR, function () {
    app.xhr.request({
      url: '/server-error',
      element: serverTarget,
      loader: loader,
      error: 'settext:#' + serverTarget.id + ':[server-error]'
    })
    mode = 'network'
    app.xhr.request({
      url: '/network-error',
      element: networkTarget,
      error: 'settext:#' + networkTarget.id + ':[network-error]'
    })
  })

  serverError = serverTarget.textContent
  networkError = networkTarget.textContent
  assertEqual(serverError, 'server-error').desc('HTTP error action applied')
  assertEqual(networkError, 'network-error').desc('network error action applied')
  assertEqual(loader.style.display, 'none').desc('loader hidden on HTTP error')
})

test('app.xhr.request - single requests abort the previous request', function () {
  var requests = []
  function FakeXHR() { requests.push(this) }
  FakeXHR.prototype.open = function () { }
  FakeXHR.prototype.setRequestHeader = function () { }
  FakeXHR.prototype.send = function () { }
  FakeXHR.prototype.abort = function () { this.aborted = true }

  var oldCurrent = app.xhr.currentRequest
  try {
    withProperty(window, 'XMLHttpRequest', FakeXHR, function () {
      app.xhr.request({ url: '/first', single: true })
      app.xhr.request({ url: '/second', single: true })
    })
    assertTrue(requests[0].aborted).desc('previous request aborted')
    assertEqual(app.xhr.currentRequest, requests[1]).desc('latest request retained')
  } finally {
    app.xhr.currentRequest = oldCurrent
  }
})
