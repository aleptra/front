function runNavigateClick(link, options) {

  options = options || {}

  var navigate = app.module.navigate
  var loaded = 0
  var loadedState = null
  var pushedUrl = null
  var pushedState = null

  withStub(navigate, 'config', navigate.config || { target: 'main' }, function () {

    withStub(navigate, '_saveScroll', function () { }, function () {

      withStub(navigate, '_scroll', function () { }, function () {

        withStub(navigate, '_load', function (state) {
          loaded++
          loadedState = state
        }, function () {

          withStub(history, 'pushState', function (state, title, url) {
            pushedState = state
            pushedUrl = url
          }, function () {

            navigate._click({
              target: link,
              preventDefault: function () { }
            })

          })

        })

      })

    })

  })

  return {
    loaded: loaded,
    loadedState: loadedState,
    pushedState: pushedState,
    pushedUrl: pushedUrl
  }
}

test('navigate-_click - same-origin URL uses pushState', function () {
  var link = createElement('a')
  link.setAttribute('href', '/next')
  var result = runNavigateClick(link)
  assertEqual(result.loaded, 1)
  assertEqual(result.loadedState.pathname, '/next')
  assertEqual(result.loadedState.external, false)
  assertEqual(result.pushedUrl, link.href)
})

test('navigate-_click - same-origin query string is preserved', function () {
  var link = createElement('a')
  link.setAttribute('href', '/next?foo=bar')
  var result = runNavigateClick(link)
  assertEqual(result.loaded, 1)
  assertEqual(result.loadedState.pathname, '/next?foo=bar')
  assertEqual(result.loadedState.external, false)
})


test('navigate-_click - external URL is loaded into target without changing browser URL', function () {
  var link = createElement('a')
  link.setAttribute('href', 'https://click.front.nu/')
  link.setAttribute('target', 'main')
  var result = runNavigateClick(link)
  assertEqual(result.loaded, 1)
  assertEqual(result.loadedState.href, 'https://click.front.nu/')
  assertEqual(result.loadedState.pathname, 'https://click.front.nu/')
  assertEqual(result.loadedState.target, 'main')
  assertEqual(result.loadedState.external, true)
  assertEqual(result.pushedUrl, window.location.href)
})

test('navigate-_click - external URL is stored in history state', function () {
  var link = createElement('a')
  link.setAttribute('href', 'https://click.front.nu/')
  link.setAttribute('target', 'main')

  var result = runNavigateClick(link)
  assertEqual(result.pushedState.href, 'https://click.front.nu/')
  assertEqual(result.pushedState.pathname, 'https://click.front.nu/')
  assertEqual(result.pushedState.target, 'main')
  assertEqual(result.pushedState.external, true)
})


test('navigate-_click - external URL with path and query is preserved', function () {
  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://click.front.nu/test?foo=bar'
  )

  link.setAttribute('target', 'main')
  var result = runNavigateClick(link)
  assertEqual(result.loaded, 1)

  assertEqual(
    result.loadedState.href,
    'https://click.front.nu/test?foo=bar'
  )

  assertEqual(
    result.loadedState.pathname,
    'https://click.front.nu/test?foo=bar'
  )
})

test('navigate-_click - target main is preserved', function () {
  var link = createElement('a')
  link.setAttribute('href', '/next')
  link.setAttribute('target', 'main')
  var result = runNavigateClick(link)
  assertEqual(result.loadedState.target, 'main')
  assertEqual(result.loadedState.skipTemplates, true)
})

test('navigate-_click - _blank is not intercepted', function () {
  var link = createElement('a')
  link.setAttribute('href', 'https://click.front.nu/')
  link.setAttribute('target', '_blank')
  var result = runNavigateClick(link)
  assertEqual(result.loaded, 0)
  assertEqual(result.pushedUrl, null)
})