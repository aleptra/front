test('auth-hide - hides authenticated content through auth-hide', function () {
  var auth = app.module.auth
  var oldValid = auth._valid
  auth._valid = true
  var element = createElement('div')
  element.setAttribute('auth-hide', '')

  try {
    app.call('rerun', { element: element })
    assertContains(element.style.cssText, 'display: none')
  } finally {
    auth._valid = oldValid
  }
})
