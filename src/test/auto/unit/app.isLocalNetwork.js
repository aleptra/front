test('app.isLocalNetwork - matches the current document location', function () {
  var expected = location.protocol === 'file:' || /localhost|127\.0\.0\.1|::1|\.local/i.test(location.hostname)

  assertType(app.isLocalNetwork, 'boolean')
  assertEqual(app.isLocalNetwork, expected)
})

test('app.isLocalNetwork - data iframe is not local', function (done) {
  var iframe = document.createElement('iframe')
  var messageName = 'app.isLocalNetwork.data-iframe'
  var finished = false
  var timer

  function cleanup() {
    window.removeEventListener('message', onMessage)
    clearTimeout(timer)
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
  }

  function finish() {
    if (finished) return false
    finished = true
    cleanup()
    return true
  }

  function onMessage(event) {
    var data = event.data
    if (!data || data.test !== messageName || !finish()) return

    assertEqual(data.protocol, 'data:').desc('uses the data protocol')
    assertEqual(data.hostname, '').desc('has an empty hostname')
    assertFalse(data.isLocalNetwork).desc('is not classified as local')
    done()
  }

  var script = document.createElement('script')
  script.src = '../../../front.js'
  var frameHtml = '<!doctype html><html><head></head><body>' +
    '<script src="' + script.src + '"><\/script>' +
    '<script>parent.postMessage({' +
    'test:"' + messageName + '",' +
    'protocol:location.protocol,' +
    'hostname:location.hostname,' +
    'isLocalNetwork:app.isLocalNetwork' +
    '},"*")<\/script>' +
    '</body></html>'

  window.addEventListener('message', onMessage)
  timer = setTimeout(function () {
    if (finish()) {
      assertTrue(false).desc('received a message from the data iframe')
      done()
    }
  }, 5000)

  iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(frameHtml)
  document.body.appendChild(iframe)
})
