test('keyboard-key - registers and executes a key attribute', function () {
  var keyboard = app.module.keyboard
  var oldKeys = keyboard.keys
  var oldWords = keyboard.words
  var oldBuffer = keyboard.buffer
  var oldPending = keyboard._wordPendingAction
  keyboard.keys = []
  keyboard.words = []
  keyboard.buffer = ''
  keyboard._wordPendingAction = null
  if (!keyboard._attributeTestAutoloaded) {
    keyboard.__autoload({ name: 'keyboard', element: document.body })
    keyboard._attributeTestAutoloaded = true
  }
  var element = createElement('button')
  var clicked = false
  element.addEventListener('click', function () { clicked = true })
  element.setAttribute('keyboard-key', 'k')
  element.setAttribute('keyboard-action', 'click')
  app.call('rerun', { element: element })
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'k', bubbles: true }))
  assertTrue(clicked)
  keyboard.keys = oldKeys
  keyboard.words = oldWords
  keyboard.buffer = oldBuffer
  keyboard._wordPendingAction = oldPending
})
