test('auth-protect - removes unauthenticated content through auth-protect', function () {
  var auth = app.module.auth
  auth._valid = false
  var element = createElement('div')
  element.setAttribute('auth-protect', '')

  app.call('rerun', { element: element })

  assertTrue(!document.contains(element))
})
