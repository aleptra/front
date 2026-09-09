(function () {
  var status = document.getElementById('status')
  var message = 'Front WebView proof of concept'

  function setStatus(value) {
    if (status) status.textContent = value
  }

  function post(command, payload) {
    var data = { command: command, payload: payload }

    // Android: expose a FrontNative JavaScript interface.
    if (window.FrontNative) {
      if (typeof window.FrontNative.invoke === 'function') {
        window.FrontNative.invoke(command, JSON.stringify(payload || {}))
        return 'Android'
      }
      if (typeof window.FrontNative[command] === 'function') {
        window.FrontNative[command](payload && payload.text || '')
        return 'Android'
      }
    }

    // iOS: receive the message with WKScriptMessageHandler.
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.frontNative) {
      window.webkit.messageHandlers.frontNative.postMessage(data)
      return 'iOS'
    }

    // Windows WebView2: receive the message with WebMessageReceived.
    if (window.chrome && window.chrome.webview && typeof window.chrome.webview.postMessage === 'function') {
      window.chrome.webview.postMessage(data)
      return 'Windows'
    }

    return false
  }

  window.frontNative = {
    post: post,

    share: function (text) {
      var platform = post('share', { text: text })
      if (platform) {
        setStatus('Share sent to the ' + platform + ' native bridge.')
      } else if (navigator.share) {
        navigator.share({ text: text })
          .then(function () { setStatus('Share completed by the browser.') })
          .catch(function () { setStatus('Share was cancelled.') })
      } else {
        setStatus('No native share bridge detected. Running in browser fallback mode.')
      }
    },

    clipboardWrite: function (text) {
      var platform = post('clipboardWrite', { text: text })
      if (platform) {
        setStatus('Clipboard request sent to the ' + platform + ' native bridge.')
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(function () { setStatus('Text copied by the browser.') })
          .catch(function () { setStatus('Browser clipboard permission was denied.') })
      } else {
        setStatus('No clipboard bridge detected.')
      }
    },

    saveState: function (value) {
      var platform = post('saveState', { value: value })
      if (platform) {
        setStatus('State sent to the ' + platform + ' native bridge.')
      } else {
        localStorage.setItem('front-webviews-state', value)
        setStatus('State saved with browser localStorage fallback.')
      }
    }
  }

  document.getElementById('share-button').addEventListener('click', function () {
    window.frontNative.share(message)
  })

  document.getElementById('clipboard-button').addEventListener('click', function () {
    window.frontNative.clipboardWrite(message)
  })

  document.getElementById('storage-button').addEventListener('click', function () {
    window.frontNative.saveState('saved from Front')
  })

  setStatus('Bridge ready. No native host detected yet.')
}())
