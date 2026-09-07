// The harness loads modules with plain script tags, so __autoload never ran and
// navigate.config is unset. Provide the minimum the click handler reads.
function withNavigateClick(callback) {
  var navigate = app.module.navigate
  return withStub(navigate, 'config', navigate.config || { target: 'main' }, function () {
    return withStub(navigate, '_saveScroll', function () { }, function () {
      return withStub(navigate, '_scroll', function () { }, function () {
        return callback(navigate)
      })
    })
  })
}

test('navigate-pushstate - false keeps the entry out of the history', function () {
  var link = createElement('a')
  var pushed = 0

  link.setAttribute('href', '/navigate-pushstate-off')
  link.setAttribute('navigate-pushstate', 'false')

  withNavigateClick(function (navigate) {
    withStub(navigate, '_load', function () { }, function () {
      withStub(history, 'pushState', function () { pushed++ }, function () {
        navigate._click({ target: link, preventDefault: function () { } })
      })
    })
  })

  assertEqual(pushed, 0)
})

test('navigate-pushstate - defaults to pushing a history entry', function () {
  var link = createElement('a')
  var state

  link.setAttribute('href', '/navigate-pushstate-on')

  withNavigateClick(function (navigate) {
    withStub(navigate, '_load', function () { }, function () {
      withStub(history, 'pushState', function (value) { state = value }, function () {
        navigate._click({ target: link, preventDefault: function () { } })
      })
    })
  })

  assertTrue(!!state)
  assertContains(state.pathname, '/navigate-pushstate-on')
})
