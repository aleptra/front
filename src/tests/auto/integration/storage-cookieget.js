test('storage-cookieget - reads the named cookie into the element', function () {
  var storage = app.module.storage
  var element = createElement('span')

  element.setAttribute('storage-cookieget', 'attributeCookie')
  document.cookie = 'attributeCookie=cookie-value;path=/'

  var value = storage._get('cookie', { exec: { element: element } })

  assertEqual(value, 'cookie-value')
  assertEqual(app.element.get(element), 'cookie-value')

  storage._remove('cookie', { exec: { value: 'attributeCookie', element: element } })
})

test('storage-cookieget - returns an empty value for a missing cookie', function () {
  var storage = app.module.storage
  var element = createElement('span')

  element.setAttribute('storage-cookieget', 'attributeCookieMissing')

  assertEqual(storage._get('cookie', { exec: { element: element } }), '')
})
