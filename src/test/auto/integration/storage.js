// --- storage-sessionset ---

test('storage - sessionset simple key/value', function () {
  sessionStorage.clear()
  app.module.storage._set('session', { exec: { value: ['simple_key', 'hello'] } })
  var result = JSON.parse(sessionStorage.getItem('simple_key'))
  assertEqual(result, 'hello')
})

test('storage - sessionset nested path', function () {
  sessionStorage.clear()
  app.module.storage._set('session', { exec: { value: ['config', 'ui', 'theme', 'dark'] } })
  var result = JSON.parse(sessionStorage.getItem('config'))
  assertEqual(result.ui.theme, 'dark')
})

test('storage - sessionset composite pairs', function () {
  sessionStorage.clear()
  app.module.storage._set('session', { exec: { value: ['test1', 'user', 'profiles', 'name', '[city][GB][country][SE]'] } })
  var result = JSON.parse(sessionStorage.getItem('test1'))
  assertEqual(result.user.profiles.name.city, 'GB')
})

// --- storage-sessionupdate ---

test('storage - sessionupdate changes nested value', function () {
  sessionStorage.clear()
  sessionStorage.setItem('config', JSON.stringify({ ui: { theme: 'dark', lang: 'en' } }))
  app.module.storage._update('session', { exec: { value: ['config', 'ui', 'lang', 'sv'] } })
  var result = JSON.parse(sessionStorage.getItem('config'))
  assertEqual(result.ui.lang, 'sv')
})

test('storage - sessionupdate preserves other keys', function () {
  sessionStorage.clear()
  sessionStorage.setItem('config', JSON.stringify({ ui: { theme: 'dark', lang: 'en' } }))
  app.module.storage._update('session', { exec: { value: ['config', 'ui', 'lang', 'sv'] } })
  var result = JSON.parse(sessionStorage.getItem('config'))
  assertEqual(result.ui.theme, 'dark')
})

test('storage - sessionupdate creates key if not exists', function () {
  sessionStorage.clear()
  sessionStorage.setItem('config', JSON.stringify({ ui: { theme: 'dark' } }))
  app.module.storage._update('session', { exec: { value: ['config', 'ui', 'lang', 'sv'] } })
  var result = JSON.parse(sessionStorage.getItem('config'))
  assertEqual(result.ui.lang, 'sv')
})

// --- storage-sessionadd ---

test('storage - sessionadd pushes single value', function () {
  sessionStorage.clear()
  sessionStorage.setItem('arr', JSON.stringify({ items: [] }))
  app.module.storage._add('session', { exec: { value: ['arr', 'items', 'apple'] } })
  var result = JSON.parse(sessionStorage.getItem('arr'))
  assertEqual(result.items[0], 'apple')
})

test('storage - sessionadd pushes multiple values', function () {
  sessionStorage.clear()
  sessionStorage.setItem('arr', JSON.stringify({ items: ['apple'] }))
  app.module.storage._add('session', { exec: { value: ['arr', 'items', '[banana][cherry]'] } })
  var result = JSON.parse(sessionStorage.getItem('arr'))
  assertEqual(result.items.length + '', '3')
})

test('storage - sessionadd unique prevents duplicates', function () {
  sessionStorage.clear()
  sessionStorage.setItem('arr', JSON.stringify({ items: ['apple'] }))
  app.module.storage._add('session', { exec: { value: ['arr', 'items', 'apple'], name: '!' } })
  var result = JSON.parse(sessionStorage.getItem('arr'))
  assertEqual(result.items.length + '', '1')
})

test('storage - sessionadd creates complex object', function () {
  sessionStorage.clear()
  sessionStorage.setItem('obj', JSON.stringify({}))
  app.module.storage._add('session', { exec: { value: ['obj', 'meta', 'info', '[version][2.0][date][2024]'] } })
  var result = JSON.parse(sessionStorage.getItem('obj'))
  assertEqual(result.meta.info.version, '2.0')
})

// --- storage-sessionremove ---

test('storage - sessionremove full key', function () {
  sessionStorage.clear()
  sessionStorage.setItem('del_me', JSON.stringify('value'))
  app.module.storage._remove('session', { exec: { value: ['del_me'] } })
  assertEqual(sessionStorage.getItem('del_me'), null)
})

test('storage - sessionremove nested property', function () {
  sessionStorage.clear()
  sessionStorage.setItem('nested', JSON.stringify({ a: { b: 'c', d: 'e' } }))
  app.module.storage._remove('session', { exec: { value: ['nested', 'a', 'b'] } })
  var result = JSON.parse(sessionStorage.getItem('nested'))
  assertEqual(result.a.d, 'e')
  assertEqual(result.a.b, undefined)
})

test('storage - sessionremove array item by value', function () {
  sessionStorage.clear()
  sessionStorage.setItem('arr_del', JSON.stringify({ list: ['x', 'y', 'z'] }))
  app.module.storage._remove('session', { exec: { value: ['arr_del', 'list', 'y'] } })
  var result = JSON.parse(sessionStorage.getItem('arr_del'))
  assertEqual(result.list.length + '', '2')
})

// --- localStorage ---

test('storage - localset works with localStorage', function () {
  localStorage.clear()
  app.module.storage._set('local', { exec: { value: ['local_test', 'name', 'Front'] } })
  var result = JSON.parse(localStorage.getItem('local_test'))
  assertEqual(result.name, 'Front')
})

test('storage - localremove removes from localStorage', function () {
  localStorage.clear()
  localStorage.setItem('local_del', JSON.stringify('bye'))
  app.module.storage._remove('local', { exec: { value: ['local_del'] } })
  assertEqual(localStorage.getItem('local_del'), null)
})

// --- cookie ---

test('storage - cookieset sets a cookie', function () {
  app.module.storage._set('cookie', { exec: { value: 'test_ck:hello', element: document.body } })
  var has = document.cookie.indexOf('test_ck=hello') !== -1
  assertTrue(has)
})

test('storage - cookieset encodes value', function () {
  app.module.storage._set('cookie', { exec: { value: 'encoded:a=b&c=d', element: document.body } })
  var has = document.cookie.indexOf('encoded=a%3Db%26c%3Dd') !== -1
  assertTrue(has)
})

test('storage - cookieget reads a cookie', function () {
  app.module.storage._set('cookie', { exec: { value: 'read_me:world', element: document.body } })
  var el = createElement('div')
  var result = app.module.storage._get('cookie', { exec: { value: 'read_me', element: el } })
  assertEqual(result, 'world')
})

test('storage - cookieremove deletes a cookie', function () {
  app.module.storage._set('cookie', { exec: { value: 'del_ck:bye', element: document.body } })
  app.module.storage._remove('cookie', { exec: { value: 'del_ck', element: document.body } })
  var gone = document.cookie.indexOf('del_ck=bye') === -1
  assertTrue(gone)
})

test('storage - cookieset with colon in value', function () {
  app.module.storage._set('cookie', { exec: { value: 'token:abc:def:ghi', element: document.body } })
  var el = createElement('div')
  var result = app.module.storage._get('cookie', { exec: { value: 'token', element: el } })
  assertEqual(result, 'abc:def:ghi')
})
