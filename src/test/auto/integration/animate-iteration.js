test('animate-iteration - applies the iteration count and defaults to a single run', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-direction', 'normal')
  element.setAttribute('animate-iteration', 'infinite')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, 'infinite normal')
  style.remove()

  var fallback = createElement('div')
  fallback.setAttribute('animate-key', '0;100')
  fallback.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  fallback.setAttribute('animate-direction', 'normal')
  fallback.setAttribute('animate-start', '')

  app.call('rerun', { element: fallback })

  var fallbackStyle = document.getElementById('animate-' + fallback.id)
  assertContains(fallbackStyle.textContent, '1 normal')
  fallbackStyle.remove()
})
