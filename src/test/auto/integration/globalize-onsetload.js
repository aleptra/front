test('globalize-onsetload - runs the callback after a language is applied', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('globalize-onsetload', 'settext:#' + target.id + ':[Language applied]')

  app.element.onload(element, 'globalize-set')

  assertEqual(target.textContent, 'Language applied')
})

test('globalize-onsetload - stays silent on elements without the attribute', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('globalize-get', 'greeting')

  app.element.onload(element, 'globalize-set')

  assertEqual(target.textContent, 'Waiting')
})
