test('animate-easing - applies the configured timing function', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-duration', '1s')
  element.setAttribute('animate-easing', 'ease-in-out')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, '1s ease-in-out')
  style.remove()
})
