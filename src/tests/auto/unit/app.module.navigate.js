test('app.module.navigate - hash links scroll to the target', function () {
  var navigate = app.module.navigate,
    target = document.createElement('div'),
    scroll
  target.id = 'section'

  withStub(app.element, 'select', function (selector) {
    return selector === '#section' ? target : null
  }, function () {
    withStub(navigate, '_scroll', function (behavior, top) {
      scroll = { behavior: behavior, top: top }
    }, function () {
      navigate._hash({ hash: '#section' })
    })
  })

  assertEqual(scroll.behavior, 'smooth').desc('scrolls hash links smoothly')
  assertEqual(scroll.top, target.offsetTop).desc('scrolls to the matching element')
})

test('app.module.navigate - popstate loads state and restores scroll', function () {
  var navigate = app.module.navigate,
    state = { pathname: '/next?item=1', target: 'main', hash: '#section' },
    loaded,
    hash,
    restored

  withStub(navigate, '_load', function (value) { loaded = value }, function () {
    withStub(navigate, '_hash', function (value) { hash = value }, function () {
      withStub(navigate, '_restoreScroll', function (wait) { restored = wait }, function () {
        navigate._pop({ state: state })
      })
    })
  })

  assertEqual(loaded, state).desc('loads the history state')
  assertEqual(hash, state).desc('handles the state hash')
  assertEqual(restored, true).desc('waits for content before restoring scroll')
})

test('app.module.navigate - saves and restores scroll position', function () {
  var navigate = app.module.navigate,
    saved,
    originalRestoring = navigate._restoring,
    waits = [],
    scrolled

  withStub(navigate, 'mainTarget', { scrollTop: 42, scrollHeight: 100 }, function () {
    withStub(navigate, '_scrollKey', function () { return '_page?item=1' }, function () {
      withStub(app.caches, 'set', function (mechanism, type, key, value) {
        saved = { mechanism: mechanism, type: type, key: key, value: value }
      }, function () {
        navigate._saveScroll()
      })
    })
  })

  assertEqual(saved.mechanism, 'window').desc('stores scroll position in window cache')
  assertEqual(saved.type, 'module').desc('stores scroll position as module data')
  assertEqual(saved.key, 'navigate_page?item=1').desc('keys the saved position by page and query')
  assertEqual(saved.value.data, '{"top":42}').desc('saves the current scroll offset')

  withStub(navigate, 'config', { target: 'main' }, function () {
    withStub(navigate, 'mainTarget', { scrollHeight: 100 }, function () {
      withStub(navigate, '_scrollKey', function () { return '_page?item=1' }, function () {
        withStub(app.caches, 'get', function () { return { top: '42' } }, function () {
          withStub(app, 'wait', function (delay, callback) {
            waits.push({ delay: delay, callback: callback })
          }, function () {
            withStub(dom, 'scroll', function (target, top) {
              scrolled = { target: target, top: top }
            }, function () {
              navigate._restoreScroll(true)
              while (waits.length) waits.shift().callback()
            })
          })
        })
      })
    })
  })

  assertEqual(waits.length, 0).desc('finishes polling once content height is stable')
  assertEqual(scrolled.target, 'main').desc('restores scroll on the configured target')
  assertEqual(scrolled.top, 42).desc('restores the saved scroll offset')
  assertEqual(navigate._restoring, false).desc('clears the restoring state when finished')
  navigate._restoring = originalRestoring
})

test('app.module.navigate - loads requested page content', function () {
  var navigate = app.module.navigate,
    originalEnterCallback = navigate._enterCallback,
    request,
    target = document.createElement('div'),
    preloader = { set: function () { }, reset: function () { } }

  try {
    withStub(navigate, 'config', {
      target: 'main', preloader: '#loader', startpage: false, startpageLocal: false,
      onleave: false, onenter: false, success: false, error: false
    }, function () {
      withStub(navigate, '_preloader', preloader, function () {
        withStub(app, 'isLocalNetwork', false, function () {
          withStub(app.globals, 'set', function () { }, function () {
            withStub(app.element, 'select', function () { return target }, function () {
              withStub(app.xhr, 'request', function (options) { request = options }, function () {
                withStub(app, 'wait', function () { }, function () {
                  navigate._load({ pathname: '/next?item=1', target: 'main', skipTemplates: true })
                })
              })
            })
          })
        })
      })
    })
  } finally {
    navigate._enterCallback = originalEnterCallback
  }
  assertEqual(request.url, '/next?item=1').desc('requests the pathname and query string')
  assertEqual(request.target, 'main').desc('loads content into the requested target')
  assertEqual(request.skipTemplates, true).desc('skips page templates for targeted navigation')
  assertEqual(request.single, true).desc('replaces any in-flight page request')
  assertEqual(request.type, 'page').desc('marks the request as page navigation')
})

test('app.module.navigate - autoload applies configuration and binds navigation events', function () {
  var navigate = app.module.navigate,
    originalSpa = app.spa,
    originalDisable = app.disable,
    originalConfig = navigate.config,
    originalMainTarget = navigate.mainTarget,
    originalOpacity = document.documentElement.style.opacity,
    config = { target: '#content', duration: 250 },
    target = document.createElement('main'),
    events = []

  try {
    withStub(app.config, 'get', function () { return config }, function () {
      withStub(app.element, 'select', function () { return target }, function () {
        withStub(app.listeners, 'add', function (element, event) {
          events.push({ element: element, event: event })
        }, function () {
          withStub(navigate, '_bindScroll', function () { }, function () {
            withStub(navigate, '_restoreScroll', function () { }, function () {
              navigate.__autoload({ element: document.createElement('script') })
            })
          })
        })
      })
    })

    assertEqual(app.spa, navigate).desc('enables SPA mode with the navigate module')
    assertEqual(navigate.config, config).desc('uses the configured navigation options')
    assertEqual(navigate.mainTarget, target).desc('selects the configured content target')
    assertEqual(events.length, 3).desc('registers the navigation event listeners')
    assertEqual(events[0].event, 'popstate').desc('listens for browser history changes')
    assertEqual(events[1].event, 'hashchange').desc('listens for hash changes')
    assertEqual(events[2].event, 'click').desc('listens for link clicks')
  } finally {
    app.spa = originalSpa
    app.disable = originalDisable
    navigate.config = originalConfig
    navigate.mainTarget = originalMainTarget
    document.documentElement.style.opacity = originalOpacity
  }
})
