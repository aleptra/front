test('keyboard-finalizer - waits for the finalizer key before running the action', function () {
  var keyboard = app.module.keyboard
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('keyboard-word', 'go')
  element.setAttribute('keyboard-finalizer', 'Enter')
  element.setAttribute('keyboard-action', 'settext:#' + target.id + ':[Word committed]')

  keyboard.buffer = ''
  keyboard._wordPendingAction = null
  app.call('rerun', { element: element })

  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'g', bubbles: true }))
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'o', bubbles: true }))

  // The word matched, but the action must not run until the finalizer arrives.
  assertEqual(target.textContent, 'Waiting')
  assertTrue(!!keyboard._wordPendingAction)

  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
  assertEqual(target.textContent, 'Word committed')
  assertEqual(keyboard._wordPendingAction, null)

  keyboard.words = keyboard.words.filter(function (w) { return w.element !== element })
  keyboard.buffer = ''
})

test('keyboard-finalizer - a different key cancels the pending action', function () {
  var keyboard = app.module.keyboard
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('keyboard-word', 'ok')
  element.setAttribute('keyboard-finalizer', 'Enter')
  element.setAttribute('keyboard-action', 'settext:#' + target.id + ':[Word committed]')

  keyboard.buffer = ''
  keyboard._wordPendingAction = null
  app.call('rerun', { element: element })

  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'o', bubbles: true }))
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'k', bubbles: true }))
  assertTrue(!!keyboard._wordPendingAction)

  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'x', bubbles: true }))
  assertEqual(keyboard._wordPendingAction, null)
  assertEqual(target.textContent, 'Waiting')

  keyboard.words = keyboard.words.filter(function (w) { return w.element !== element })
  keyboard.buffer = ''
})
