test('toggledisplay - should hide and restore an element', function () {
  var element = createElement('div')
  element.style.display = 'block'

  app.call('toggledisplay:#' + element.id)
  assertStyleEqual(element, 'display', 'none')

  app.call('toggledisplay:#' + element.id)
  assertStyleEqual(element, 'display', 'block')
})
