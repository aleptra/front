// navigate.config is only populated by __autoload, which the harness bypasses.
function runNavigateClick(link) {
  var navigate = app.module.navigate
  var loaded = 0

  withStub(navigate, 'config', navigate.config || { target: 'main' }, function () {
    withStub(navigate, '_saveScroll', function () { }, function () {
      withStub(navigate, '_scroll', function () { }, function () {
        withStub(navigate, '_load', function () { loaded++ }, function () {
          withStub(history, 'pushState', function () { }, function () {
            navigate._click({ target: link, preventDefault: function () { } })
          })
        })
      })
    })
  })

  return loaded
}

test('navigate-onloaded - runs the body callback when a page navigation starts', function () {
  var target = createElement('div')
  var link = createElement('a')

  target.textContent = 'Waiting'
  link.setAttribute('href', '/navigate-onloaded-page')
  document.body.setAttribute('navigate-onloaded', 'settext:#' + target.id + ':[Navigated]')

  try {
    assertEqual(runNavigateClick(link), 1)
    assertEqual(target.textContent, 'Navigated')
  } finally {
    document.body.removeAttribute('navigate-onloaded')
  }
})

test('navigate-onloaded - is optional', function () {
  var link = createElement('a')

  link.setAttribute('href', '/navigate-onloaded-missing')
  document.body.removeAttribute('navigate-onloaded')

  assertEqual(runNavigateClick(link), 1)
})
