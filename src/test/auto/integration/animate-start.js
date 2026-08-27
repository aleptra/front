test('animate-start - creates keyframes through animate-start', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-duration', '2s')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertTrue(!!style)
  assertContains(style.textContent, '@keyframes animate-' + element.id)
  assertContains(style.textContent, '2s')
  style.remove()
})
