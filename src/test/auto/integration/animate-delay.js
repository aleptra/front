test('animate-delay - applies the configured delay and defaults to 0s', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-easing', 'linear')
  element.setAttribute('animate-delay', '0.75s')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, 'linear 0.75s')
  style.remove()

  var fallback = createElement('div')
  fallback.setAttribute('animate-key', '0;100')
  fallback.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  fallback.setAttribute('animate-easing', 'linear')
  fallback.setAttribute('animate-start', '')

  app.call('rerun', { element: fallback })

  var fallbackStyle = document.getElementById('animate-' + fallback.id)
  assertContains(fallbackStyle.textContent, 'linear 0s')
  fallbackStyle.remove()
})
