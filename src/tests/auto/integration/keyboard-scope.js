test('keyboard-scope - body scope only fires while the body is focused', function () {
  var keyboard = app.module.keyboard
  var target = createElement('div')
  var element = createElement('div')

  // The field must live in the rendered document, otherwise focus() is a no-op
  // and document.activeElement stays on the body.
  var input = document.createElement('input')
  input.id = 'keyboardScopeInput'
  document.body.appendChild(input)

  target.textContent = 'Waiting'
  element.setAttribute('keyboard-key', 'b')
  element.setAttribute('keyboard-scope', 'body')
  element.setAttribute('keyboard-action', 'settext:#' + target.id + ':[Body scope ran]')

  app.call('rerun', { element: element })

  try {
    input.focus()
    assertEqual(document.activeElement, input)

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'b', bubbles: true }))
    assertEqual(target.textContent, 'Waiting')

    input.blur()
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'b', bubbles: true }))
    assertEqual(target.textContent, 'Body scope ran')
  } finally {
    input.parentNode.removeChild(input)
    keyboard.keys = keyboard.keys.filter(function (k) { return k.element !== element })
  }
})

test('keyboard-scope - an empty scope requires the element itself to be the target', function () {
  var keyboard = app.module.keyboard
  var target = createElement('div')
  var element = createElement('input')

  target.textContent = 'Waiting'
  element.setAttribute('keyboard-key', 'Escape')
  element.setAttribute('keyboard-scope', '')
  element.setAttribute('keyboard-action', 'settext:#' + target.id + ':[Element scope ran]')

  app.call('rerun', { element: element })

  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }))
  assertEqual(target.textContent, 'Waiting')

  element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }))
  assertEqual(target.textContent, 'Element scope ran')

  keyboard.keys = keyboard.keys.filter(function (k) { return k.element !== element })
})
