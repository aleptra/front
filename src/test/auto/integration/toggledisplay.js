test('toggledisplay - should hide and restore an element', function () {
  var element = createElement('div')
  element.style.display = 'block'

  app.call('toggledisplay:#' + element.id)
  assertStyleEqual(element, 'display', 'none')

  app.call('toggledisplay:#' + element.id)
  assertStyleEqual(element, 'display', 'block')
})

test.skip('toggle - should run the ontoggle callback', function () {
  var target = createElement('div')
  var element = createElement('div')
  element.setAttribute('ontoggle', 'settext:[toggled]')

  app.call('toggledisplay:#' + element.id)

  assertEqual(element.textContent, 'toggled')
  assertEqual(target.textContent, '')
})
