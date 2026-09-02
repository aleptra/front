test('onmouseoutif - blocks the mouseout action when the condition is not met', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('mouseout', 'settext:#' + target.id + ':[Left]')
  element.setAttribute('onmouseoutif', 'settext:#' + target.id + ':[Guard ran]')

  element.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))

  assertEqual(target.textContent, 'Guard ran')
})

test('onmouseoutif - the mouseout action runs without a guard', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('mouseout', 'settext:#' + target.id + ':[Left]')

  element.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))

  assertEqual(target.textContent, 'Left')
})
