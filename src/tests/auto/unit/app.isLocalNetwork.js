var dataIframeNetworkTest = {
  iframe: null,
  messageName: 'app.isLocalNetwork.data-iframe',
  done: null,
  finished: false,
  timer: null,
  messageHandler: null,

  cleanup: function () {
    window.removeEventListener('message', this.messageHandler)
    clearTimeout(this.timer)
    if (this.iframe.parentNode) this.iframe.parentNode.removeChild(this.iframe)
  },

  finish: function () {
    if (this.finished) return false
    this.finished = true
    this.cleanup()
    return true
  },

  onMessage: function (event) {
    var data = event.data
    if (!data || data.test !== this.messageName || !this.finish()) return

    assertEqual(data.protocol, 'data:').desc('uses the data protocol')
    assertEqual(data.hostname, '').desc('has an empty hostname')
    assertFalse(data.isLocalNetwork).desc('is not classified as local')
    this.done()
  },

  onTimeout: function () {
    if (!this.finish()) return
    assertTrue(false).desc('received a message from the data iframe')
    this.done()
  },

  run: function (done) {
    this.done = done
    this.finished = false
    this.iframe = document.createElement('iframe')

    var script = document.createElement('script')
    script.src = new URL('../../../front.js', window.location.href).href
    var frameHtml = '<!doctype html><html><head></head><body>' +
      '<script src="' + script.src + '"><\/script>' +
      '<script>parent.postMessage({' +
      'test:"' + this.messageName + '",' +
      'protocol:location.protocol,' +
      'hostname:location.hostname,' +
      'isLocalNetwork:app.isLocalNetwork' +
      '},"*")<\/script>' +
      '</body></html>'

    this.messageHandler = this.onMessage.bind(this)
    window.addEventListener('message', this.messageHandler)
    this.timer = setTimeout(this.onTimeout.bind(this), 5000)
    this.iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(frameHtml)
    document.body.appendChild(this.iframe)
  }
}

test('app.isLocalNetwork - matches the current document location', function () {
  var expected = location.protocol === 'file:' || /localhost|127\.0\.0\.1|::1|\.local/i.test(location.hostname)

  assertType(app.isLocalNetwork, 'boolean')
  assertEqual(app.isLocalNetwork, expected)
})

test('app.isLocalNetwork - data iframe is not local', dataIframeNetworkTest.run.bind(dataIframeNetworkTest))
