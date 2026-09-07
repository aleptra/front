test('animate-direction - applies the configured direction and defaults to normal', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-direction', 'alternate-reverse')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, 'alternate-reverse')
  style.remove()

  var fallback = createElement('div')
  fallback.setAttribute('animate-key', '0;100')
  fallback.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  fallback.setAttribute('animate-start', '')

  app.call('rerun', { element: fallback })

  var fallbackStyle = document.getElementById('animate-' + fallback.id)
  assertContains(fallbackStyle.textContent, 'normal')
  fallbackStyle.remove()
})
