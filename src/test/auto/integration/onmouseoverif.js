test('onmouseoverif - blocks the mouseover action when the condition is not met', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('mouseover', 'settext:#' + target.id + ':[Hovered]')
  element.setAttribute('onmouseoverif', 'settext:#' + target.id + ':[Guard ran]')

  element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

  // The guard produced no truthy result, so the mouseover action is skipped.
  assertEqual(target.textContent, 'Guard ran')
})

test('onmouseoverif - the mouseover action runs without a guard', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('mouseover', 'settext:#' + target.id + ':[Hovered]')

  element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

  assertEqual(target.textContent, 'Hovered')
})
