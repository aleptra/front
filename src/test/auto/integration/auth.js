function authToken(payload) {
  var encoded = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return 'header.' + encoded + '.signature'
}

function resetAuthState() {
  var auth = app.module.auth
  if (auth._expiryTimer) clearTimeout(auth._expiryTimer)
  localStorage.removeItem(auth._storageKey)
  auth._token = null
  auth._user = null
  auth._valid = false
  app.globals.set('authenticated', false)
  app.globals.set('authUser', null)
}

test('auth - valid login stores and exposes JWT state', function () {
  var auth = app.module.auth
  resetAuthState()
  var token = authToken({ sub: 'user-1', email: 'user@example.test', role: 'editor', exp: Math.floor(Date.now() / 1000) + 3600 })

  auth.login(token)

  assertTrue(auth.isValid())
  assertEqual(auth.getToken(), token)
  assertEqual(auth.getHeader(), 'Bearer ' + token)
  assertEqual(auth.getClaim('role'), 'editor')
  assertEqual(auth.getUser().email, 'user@example.test')
  assertEqual(localStorage.getItem(auth._storageKey), token)
  assertTrue(app.globals.get('authenticated'))

  resetAuthState()
})

test('auth - malformed and expired tokens are invalid', function () {
  var auth = app.module.auth
  resetAuthState()

  auth.login('not-a-jwt')
  assertFalse(auth.isValid())
  assertEqual(auth.getToken(), null)
  assertEqual(auth.getHeader(), '')
  assertEqual(auth.getUser(), null)

  var expired = authToken({ sub: 'expired', exp: Math.floor(Date.now() / 1000) - 1 })
  localStorage.setItem(auth._storageKey, expired)
  auth.__autoload({ element: document.body })
  assertFalse(auth.isValid())
  assertEqual(localStorage.getItem(auth._storageKey), null)

  resetAuthState()
})

test('auth - logout clears token, globals, and emits logout', function () {
  var auth = app.module.auth
  resetAuthState()
  var token = authToken({ sub: 'user-2', exp: Math.floor(Date.now() / 1000) + 3600 })
  var received = false
  var listener = function () { received = true }

  window.addEventListener('auth:logout', listener)
  auth.login(token)
  auth.logout()
  window.removeEventListener('auth:logout', listener)

  assertFalse(auth.isValid())
  assertEqual(auth.getToken(), null)
  assertEqual(localStorage.getItem(auth._storageKey), null)
  assertFalse(app.globals.get('authenticated'))
  assertEqual(app.globals.get('authUser'), null)
  assertTrue(received)
})

test('auth - expiry clears state and emits auth:expired', function () {
  var auth = app.module.auth
  resetAuthState()
  var token = authToken({ sub: 'user-3', exp: Math.floor(Date.now() / 1000) + 3600 })
  var received = false
  var listener = function () { received = true }

  auth.login(token)
  window.addEventListener('auth:expired', listener)
  auth._onExpiry()
  window.removeEventListener('auth:expired', listener)

  assertFalse(auth.isValid())
  assertEqual(localStorage.getItem(auth._storageKey), null)
  assertTrue(received)

  resetAuthState()
})
