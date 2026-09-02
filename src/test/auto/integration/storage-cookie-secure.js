test('storage-cookie-secure - adds the Secure flag only for the literal true value', function () {
  var storage = app.module.storage
  var secure = createElement('div')

  secure.setAttribute('storage-cookie-secure', 'true')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'secured:value', element: secure } })
    assertContains(document.cookie, ';Secure')
  })

  var insecure = createElement('div')
  insecure.setAttribute('storage-cookie-secure', 'false')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'plain:value', element: insecure } })
    assertEqual(document.cookie.indexOf(';Secure'), -1)
  })
})
