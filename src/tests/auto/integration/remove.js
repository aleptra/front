test('remove - should detach an element', function () {
  var element = createElement('div')
  var parent = element.parentNode

  dom.remove(element)

  assertFalse(parent.contains(element))
})
