test('auth-show - hides unauthenticated content through auth-show', function () {
  var auth = app.module.auth
  auth._valid = false
  var element = createElement('div')
  element.setAttribute('auth-show', '')

  app.call('rerun', { element: element })

  assertContains(element.style.cssText, 'display: none')
})
