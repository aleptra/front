test('animate-stop - removes animation styles through animate-stop', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateX(0);translateX(10px)')
  element.setAttribute('animate-start', '')
  app.call('rerun', { element: element })
  var style = document.getElementById('animate-' + element.id)
  element.setAttribute('animate-stop', '')

  app.call('rerun', { element: element })
  assertContains(element.style.animation, 'none')
  if (style) style.remove()
})
