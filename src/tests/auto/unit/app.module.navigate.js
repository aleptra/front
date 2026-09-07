test('app.module.navigate - targeted link preserves query and skips templates', function (done) {
  function run() {
    var navigate = app.module && app.module.navigate

    if (!navigate) {
      assertTrue(false).desc('navigate module is loaded')
      done()
      return
    }

    var originalLoad = navigate._load
    var originalSaveScroll = navigate._saveScroll
    var originalScroll = navigate._scroll
    var originalWait = app.wait
    var state
    var link = document.createElement('a')

    link.href = 'table.html?i=animal'
    link.target = 'main'
    link.setAttribute('navigate-pushstate', 'false')
    document.body.appendChild(link)

    navigate._load = function (value) {
      state = value
    }
    navigate._saveScroll = function () { }
    navigate._scroll = function () { }
    app.wait = function () { }

    try {
      navigate._click({
        target: link,
        preventDefault: function () { }
      })

      assertEqual(state.pathname, link.pathname + link.search).desc('preserves query string')
      assertEqual(state.target, 'main').desc('uses the explicit target')
      assertTrue(state.skipTemplates).desc('skips templates for targeted navigation')
    } finally {
      navigate._load = originalLoad
      navigate._saveScroll = originalSaveScroll
      navigate._scroll = originalScroll
      app.wait = originalWait
      link.remove()
      done()
    }
  }

  if (app.module && app.module.navigate) {
    run()
    return
  }

  var script = document.createElement('script')
  script.src = '../../../modules/navigate.js'
  script.onload = run
  script.onerror = function () {
    assertTrue(false).desc('navigate module loaded')
    done()
  }
  document.head.appendChild(script)
})
