test('animate-duration - applies the configured duration and defaults to 1s', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-duration', '2.5s')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, 'animation: animate-' + element.id + ' 2.5s')
  style.remove()

  var fallback = createElement('div')
  fallback.setAttribute('animate-key', '0;100')
  fallback.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  fallback.setAttribute('animate-start', '')

  app.call('rerun', { element: fallback })

  var fallbackStyle = document.getElementById('animate-' + fallback.id)
  assertContains(fallbackStyle.textContent, 'animation: animate-' + fallback.id + ' 1s')
  fallbackStyle.remove()
})
