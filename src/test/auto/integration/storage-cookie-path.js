test('storage-cookie-path - writes the configured path and defaults to root', function () {
  var storage = app.module.storage
  var element = createElement('div')

  element.setAttribute('storage-cookie-path', '/admin')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'scoped:value', element: element } })
    assertContains(document.cookie, ';path=/admin')
  })

  var fallback = createElement('div')
  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'unscoped:value', element: fallback } })
    assertContains(document.cookie, ';path=/')
  })
})

test('storage-cookie-path - is reused when removing the cookie', function () {
  var storage = app.module.storage
  var element = createElement('div')

  element.setAttribute('storage-cookie-path', '/admin')

  withProperty(document, 'cookie', '', function () {
    storage._remove('cookie', { exec: { value: 'scoped', element: element } })
    assertContains(document.cookie, ';path=/admin')
    assertContains(document.cookie, 'expires=Thu, 01 Jan 1970')
  })
})
