test('storage-cookie-samesite - writes the configured policy and defaults to Lax', function () {
  var storage = app.module.storage
  var strict = createElement('div')

  strict.setAttribute('storage-cookie-samesite', 'Strict')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'strictcookie:value', element: strict } })
    assertContains(document.cookie, ';SameSite=Strict')
  })

  var fallback = createElement('div')

  withProperty(document, 'cookie', '', function () {
    storage._set('cookie', { exec: { value: 'laxcookie:value', element: fallback } })
    assertContains(document.cookie, ';SameSite=Lax')
  })
})
