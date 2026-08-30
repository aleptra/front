test('app.caches - stores JSON, resolves variable references, and reads parsed data', function () {
  app.caches.set('window', 'var', 'coverage-json', {
    data: '{"name":"Ada","greeting":"{name}","literal":"{missing}"}',
    status: 200,
    headers: { type: 'json' }
  }, 'json')

  var cache = app.caches.get('window', 'var', 'coverage-json')
  assertEqual(cache.data.name, 'Ada').desc('JSON value stored')
  assertEqual(cache.data.greeting, 'Ada').desc('top-level variable reference resolved')
  assertEqual(cache.data.literal, '{missing}').desc('unknown reference preserved')
})

test('app.caches - parses XML and fetches serialized JSON', function () {
  app.caches.set('window', 'var', 'coverage-xml', {
    data: '<root><item>value</item></root>'
  }, 'xml')
  app.caches.set('window', 'var', 'coverage-serialized', {
    data: '{"ready":true}'
  })

  var xml = app.caches.get('window', 'var', 'coverage-xml')
  var parsed = app.caches.get('window', 'var', 'coverage-serialized', { fetchJson: true })
  assertEqual(xml.data.documentElement.nodeName, 'root').desc('XML document stored')
  assertEqual(xml.data.querySelector('item').textContent, 'value').desc('XML content preserved')
  assertTrue(parsed.ready).desc('serialized JSON parsed on read')
})

test('app.caches - persists, prefixes, and removes local and session entries', function () {
  var oldStorageKey = app.storageKey
  app.storageKey = 'coverage'

  try {
    app.caches.set('local', 'var', 'local-value', { data: 'local' })
    app.caches.set('session', 'var', 'session-value', { data: 'session' })

    assertTrue(!!localStorage.getItem('coverage_local-value')).desc('local key is prefixed')
    assertEqual(app.caches.get('local', 'var', 'local-value').data, 'local').desc('local value read')
    assertEqual(app.caches.get('session', 'var', 'session-value').data, 'session').desc('session value read')

    app.caches.remove('local', 'local-value')
    app.caches.remove('session', 'session-value')
    assertEqual(localStorage.getItem('coverage_local-value'), null).desc('local value removed')
    assertEqual(sessionStorage.getItem('coverage_session-value'), null).desc('session value removed')
  } finally {
    app.storageKey = oldStorageKey
    localStorage.removeItem('coverage_local-value')
    sessionStorage.removeItem('coverage_session-value')
  }
})

test('app.caches - validates a live TTL and removes an expired TTL', function () {
  app.caches.set('local', 'var', 'coverage-ttl', { data: 'live' }, null, 10000)
  var live = app.caches.validate({ ttl: 10000, keyType: 'var', storageKey: 'coverage-ttl' })
  assertEqual(live.data, 'live').desc('unexpired cache returned')

  localStorage.setItem('coverage-expired', JSON.stringify({ data: 'old', ttl: 1, expires: 0 }))
  var expired = app.caches.validate({ ttl: 1, keyType: 'var', storageKey: 'coverage-expired' })
  assertEqual(expired, undefined).desc('expired cache rejected')
  assertEqual(localStorage.getItem('coverage-expired'), null).desc('expired cache removed')
  localStorage.removeItem('coverage-ttl')
})

test('app.caches - writes cookie data through the cookie mechanism', function () {
  app.caches.set('cookie', 'var', 'coverage-cookie', { data: 'frontCoverageCookie=ready' })
  assertContains(app.caches.get('cookie', 'var', 'coverage-cookie'), 'frontCoverageCookie=ready').desc('cookie value available')
})
