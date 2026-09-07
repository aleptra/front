test('toggledisplay - should hide and restore an element', function () {
  var element = createElement('div')
  element.style.display = 'block'

  app.call('toggledisplay:#' + element.id)
  assertStyleEqual(element, 'display', 'none')

  app.call('toggledisplay:#' + element.id)
  assertStyleEqual(element, 'display', 'block')
})

// Source limitation: ontoggle calls app.exec('app.element.<fn>', {element, value}),
// but app.element.set expects (element, value) so the value never reaches the node.
test.skip('toggle - should run the ontoggle callback', function () {
  var target = createElement('div')
  var element = createElement('div')
  // ontoggle takes an app.element function in "name[value]" form.
  element.setAttribute('ontoggle', 'set[toggled]')

  app.call('toggledisplay:#' + element.id)

  assertEqual(element.textContent, 'toggled')
  assertEqual(target.textContent, '')
})
