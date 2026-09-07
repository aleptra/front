test('animate-key - generates a keyframe stop for every configured percentage', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0;50;100')
  element.setAttribute('animate-transform', 'scale(1);scale(1.5);scale(1)')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, '0% { transform: scale(1) }')
  assertContains(style.textContent, '50% { transform: scale(1.5) }')
  assertContains(style.textContent, '100% { transform: scale(1) }')
  style.remove()
})

test('animate-key - tolerates whitespace around percentages', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0 ; 100')
  element.setAttribute('animate-transform', 'scale(1) ; scale(2)')
  element.setAttribute('animate-start', '')

  app.call('rerun', { element: element })

  var style = document.getElementById('animate-' + element.id)
  assertContains(style.textContent, '0% { transform: scale(1) }')
  assertContains(style.textContent, '100% { transform: scale(2) }')
  style.remove()
})
