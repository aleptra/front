
function runNavigateClick(link) {

  var navigate = app.module.navigate

  var loaded = 0
  var loadedState = null
  var pushedState = null
  var pushedUrl = null

  withStub(
    navigate,
    'config',
    navigate.config || { target: 'main' },
    function () {

      withStub(
        navigate,
        '_saveScroll',
        function () { },
        function () {

          withStub(
            navigate,
            '_scroll',
            function () { },
            function () {

              withStub(
                navigate,
                '_load',
                function (state) {
                  loaded++
                  loadedState = state
                },
                function () {

                  withStub(
                    history,
                    'pushState',
                    function (state, title, url) {
                      pushedState = state
                      pushedUrl = url
                    },
                    function () {

                      navigate._click({
                        target: link,
                        preventDefault: function () { }
                      })

                    }
                  )

                }
              )

            }
          )

        }
      )

    }
  )

  return {
    loaded: loaded,
    loadedState: loadedState,
    pushedState: pushedState,
    pushedUrl: pushedUrl
  }
}


test('navigate-back - calls history back through navigate-back', function () {

  var called = false

  withStub(
    window.history,
    'back',
    function () {
      called = true
    },
    function () {

      var button = createElement('button')

      button.setAttribute(
        'click',
        'navigate-back'
      )

      app.call(
        button.getAttribute('click'),
        {
          srcElement: button
        }
      )

    }
  )

  assertTrue(called)

})


test('navigate-forward - calls history forward through navigate-forward', function () {

  var called = false

  withStub(
    window.history,
    'forward',
    function () {
      called = true
    },
    function () {

      var button = createElement('button')

      button.setAttribute(
        'click',
        'navigate-forward'
      )

      app.call(
        button.getAttribute('click'),
        {
          srcElement: button
        }
      )

    }
  )

  assertTrue(called)

})


test('navigate-go - handles a destination through navigate-go', function () {

  var clickedHref = ''

  var anchorPrototype =
    window.HTMLAnchorElement &&
    window.HTMLAnchorElement.prototype

  var button = createElement('button')

  button.setAttribute(
    'click',
    'navigate-go:[/next]'
  )

  withStub(
    anchorPrototype,
    'click',
    function () {
      clickedHref = this.href
    },
    function () {

      app.call(
        button.getAttribute('click'),
        {
          srcElement: button
        }
      )

    }
  )

  assertTrue(
    clickedHref.indexOf('/next') !== -1
  )

})


test('navigate-onloaded - runs the body callback when a page navigation starts', function () {

  var target = createElement('div')

  var link = createElement('a')

  target.textContent = 'Waiting'

  link.setAttribute(
    'href',
    '/navigate-onloaded-page'
  )

  document.body.setAttribute(
    'navigate-onloaded',
    'settext:#' + target.id + ':[Navigated]'
  )

  try {

    assertEqual(
      runNavigateClick(link).loaded,
      1
    )

    assertEqual(
      target.textContent,
      'Navigated'
    )

  } finally {

    document.body.removeAttribute(
      'navigate-onloaded'
    )

  }

})


test('navigate-onloaded - is optional', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    '/navigate-onloaded-missing'
  )

  document.body.removeAttribute(
    'navigate-onloaded'
  )

  assertEqual(
    runNavigateClick(link).loaded,
    1
  )

})


test('navigate-click - same-origin URL uses pushState', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    '/next'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loaded,
    1
  )

  assertEqual(
    result.loadedState.href,
    link.href
  )

  assertEqual(
    result.loadedState.pathname,
    '/next'
  )

  assertEqual(
    result.loadedState.external,
    false
  )

  assertEqual(
    result.pushedUrl,
    link.href
  )

})


test('navigate-click - same-origin query string is preserved', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    '/next?foo=bar'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loaded,
    1
  )

  assertEqual(
    result.loadedState.pathname,
    '/next?foo=bar'
  )

  assertEqual(
    result.loadedState.external,
    false
  )

})


test('navigate-click - external HTTPS URL loads into main', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://save.aleptra.com/'
  )

  link.setAttribute(
    'target',
    'main'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loaded,
    1
  )

  assertEqual(
    result.loadedState.href,
    'https://save.aleptra.com/'
  )

  assertEqual(
    result.loadedState.pathname,
    'https://save.aleptra.com/'
  )

  assertEqual(
    result.loadedState.target,
    'main'
  )

  assertEqual(
    result.loadedState.external,
    true
  )

})


test('navigate-click - external HTTPS URL is stored in history state', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://save.aleptra.com/'
  )

  link.setAttribute(
    'target',
    'main'
  )

  var result = runNavigateClick(link)

  assertTrue(
    result.pushedState !== null
  )

  assertEqual(
    result.pushedState.href,
    'https://save.aleptra.com/'
  )

  assertEqual(
    result.pushedState.pathname,
    'https://save.aleptra.com/'
  )

  assertEqual(
    result.pushedState.target,
    'main'
  )

  assertEqual(
    result.pushedState.external,
    true
  )

})


test('navigate-click - external HTTPS URL does not change browser URL', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://save.aleptra.com/'
  )

  link.setAttribute(
    'target',
    'main'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.pushedUrl,
    window.location.href
  )

})


test('navigate-click - external HTTPS URL with path and query is preserved', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://save.aleptra.com/test?foo=bar'
  )

  link.setAttribute(
    'target',
    'main'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loaded,
    1
  )

  assertEqual(
    result.loadedState.href,
    'https://save.aleptra.com/test?foo=bar'
  )

  assertEqual(
    result.loadedState.pathname,
    'https://save.aleptra.com/test?foo=bar'
  )

})


test('navigate-click - target main is preserved', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    '/next'
  )

  link.setAttribute(
    'target',
    'main'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loaded,
    1
  )

  assertEqual(
    result.loadedState.target,
    'main'
  )

  assertEqual(
    result.loadedState.skipTemplates,
    true
  )

})


test('navigate-click - external HTTPS URL uses target main', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://save.aleptra.com/'
  )

  link.setAttribute(
    'target',
    'main'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loadedState.target,
    'main'
  )

})


test('navigate-click - blank target is not intercepted', function () {

  var link = createElement('a')

  link.setAttribute(
    'href',
    'https://save.aleptra.com/'
  )

  link.setAttribute(
    'target',
    '_blank'
  )

  var result = runNavigateClick(link)

  assertEqual(
    result.loaded,
    0
  )

  assertEqual(
    result.pushedUrl,
    null
  )

})