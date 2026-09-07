test('storage-cookie-days - adds an expiry when a lifetime is configured', function () {
  var storage = app.module.storage
  var element = createElement('div')

  element.setAttribute('storage-cookie-days', '7')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'persisted:value', element: element } })
    assertContains(document.cookie, ';expires=')
  })
})

test('storage-cookie-days - writes a session cookie when omitted', function () {
  var storage = app.module.storage
  var element = createElement('div')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'temporary:value', element: element } })
    assertEqual(document.cookie.indexOf(';expires='), -1)
  })
})
