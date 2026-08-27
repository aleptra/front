test('data-request - reqpost forwards request attributes', function () {
  var element = createFixture('div', {
    'data-reqpost': '/api/items',
    'data-header': 'Accept:application/json',
    'data-credentials': 'true',
    'data-loader': '#loader'
  })

  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    app.module.data.reqpost({ exec: { element: element } })
  })

  assertEqual(request.url, '/api/items')
  assertEqual(request.method, 'post')
  assertEqual(request.headers, 'Accept:application/json')
  assertTrue(request.credentials)
  assertEqual(request.loader, '#loader')
  assertEqual(request.srcEl, element)
})

test('data-request - csrf token is appended to configured headers', function () {
  var element = createElement('div')
  element.setAttribute('data-reqpatch', '/api/items/1')
  element.setAttribute('data-header', 'Accept:application/json')
  element.setAttribute('data-csrf', 'csrf_token')
  app.module.storage._set('cookie', { exec: { value: 'csrf_token:csrf-value', element: element } })

  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    app.module.data.reqpatch({ exec: { element: element } })
  })

  assertEqual(request.headers, 'Accept:application/json;X-CSRF-Token:csrf-value')
  assertEqual(request.method, 'patch')

  app.module.storage._remove('cookie', { exec: { value: 'csrf_token', element: element } })
})

test('data-request - form action is used and empty form action is ignored', function () {
  var form = createElement('form')
  form.setAttribute('action', '/submit')
  form.setAttribute('method', 'post')

  var request
  withStub(app.xhr, 'request', function (options) { request = options }, function () {
    app.module.data._form({ srcElement: form, preventDefault: function () { } })
  })
  assertEqual(request.url, '/submit')
  assertEqual(request.method, 'post')

  var emptyForm = createElement('form')
  emptyForm.setAttribute('method', 'post')
  var called = false
  withStub(app.xhr, 'request', function () { called = true }, function () {
    app.module.data._request('post', emptyForm)
  })
  assertFalse(called)
})

test('data-request - response field can be stored in localStorage', function () {
  withStorage('local', 'auth-token', null, function () {
    app.module.data.store({
      options: { response: { data: { user: { token: 'abc123' } } } },
      exec: { value: ['local', 'auth-token', 'user.token'] }
    })

    assertEqual(localStorage.getItem('auth-token'), 'abc123')
  })
  assertEqual(localStorage.getItem('auth-token'), null)
})

test('data-resolution - supports root, lookup, OR, and AND paths', function () {
  var data = {
    users: [{ id: '1', name: 'Ada' }, { id: '2', name: 'Lin' }],
    profile: { name: 'Grace', role: 'admin' }
  }
  var options = {
    data: data,
    fullObject: data.users,
    keys: ['users'],
    index: 0
  }

  assertEqual(app.module.data._resolve(data.users[0], '[].profile.name', options), 'Grace')
  assertEqual(app.module.data._resolve(data.users[0], '(id%2).name', { data: data.users }), 'Lin')
  assertEqual(app.module.data._resolve({ title: 'Fallback' }, 'missing||title', {}), 'Fallback')
  assertEqual(app.module.data._resolve({ first: 'Ada', last: 'Lovelace' }, 'first&&last', {}), 'Ada Lovelace')
  assertEqual(app.module.data._resolve({ value: null }, 'value', {}), '')
})
