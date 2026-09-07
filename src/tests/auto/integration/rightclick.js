test('rightclick - runs the action on a context menu event', function () {
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('rightclick', 'settext:#' + target.id + ':[Context menu]')

  var event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
  element.dispatchEvent(event)

  assertEqual(target.textContent, 'Context menu')
  assertTrue(event.defaultPrevented)
})

test('rightclick - elements without the attribute are untouched', function () {
  var element = createElement('div')

  var event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
  element.dispatchEvent(event)

  assertFalse(event.defaultPrevented)
})
