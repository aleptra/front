test('keyboard-action - runs a declarative action for the bound key', function () {
  var keyboard = app.module.keyboard
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('keyboard-key', 'j')
  element.setAttribute('keyboard-action', 'settext:#' + target.id + ':[Action ran]')

  app.call('rerun', { element: element })
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'j', bubbles: true }))

  assertEqual(target.textContent, 'Action ran')

  keyboard.keys = keyboard.keys.filter(function (k) { return k.element !== element })
})

test('keyboard-action - click triggers a real click on the element', function () {
  var keyboard = app.module.keyboard
  var element = createElement('div')
  var clicked = false

  element.setAttribute('keyboard-key', 'q')
  element.setAttribute('keyboard-action', 'click')
  element.addEventListener('click', function () { clicked = true })

  app.call('rerun', { element: element })
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'q', bubbles: true }))

  assertTrue(clicked)

  keyboard.keys = keyboard.keys.filter(function (k) { return k.element !== element })
})
