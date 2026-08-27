test('keyboard-word - executes a finalized word attribute', function () {
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
  var element = createElement('div')
  element.setAttribute('keyboard-word', 'open')
  var clicked = false
  element.addEventListener('click', function () { clicked = true })
  element.setAttribute('keyboard-action', 'click')
  element.setAttribute('keyboard-finalizer', 'Enter')
  app.call('rerun', { element: element })
    ;['o', 'p', 'e', 'n'].forEach(function (key) {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: key, bubbles: true }))
    })
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
  assertTrue(clicked)
  keyboard.keys = oldKeys
  keyboard.words = oldWords
  keyboard.buffer = oldBuffer
  keyboard._wordPendingAction = oldPending
})
