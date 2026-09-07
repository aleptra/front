test('app.startup - duplicate front.js evaluation preserves the initialized app', function (done) {
  var originalApp = window.app,
    originalScript = originalApp && originalApp.script,
    originalExtensions = originalApp && originalApp.extensions,
    duplicate = document.createElement('script')

  duplicate.src = '../../../front.js?duplicate=' + new Date().getTime()
  duplicate.onload = function () {
    assertTrue(window.app === originalApp)
    assertTrue(window.app.script === originalScript)
    assertTrue(window.app.extensions === originalExtensions)
    assertTrue(!!(window.app.script && window.app.script.element))
    duplicate.parentNode.removeChild(duplicate)
    done()
  }
  duplicate.onerror = function () {
    assertTrue(false)
    duplicate.parentNode.removeChild(duplicate)
    done()
  }

  document.head.appendChild(duplicate)
})
