test('animate-transform - maps each transform to its matching keyframe', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;100')
  element.setAttribute('animate-transform', 'translateY(0) rotate(0deg);translateY(-20px) rotate(180deg)')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, '0% { transform: translateY(0) rotate(0deg) }')
  assertContains(style.textContent, '100% { transform: translateY(-20px) rotate(180deg) }')
  style.remove()
})
