test('togglevalue - should toggle the _dn class', function () {
  var element = createElement('div')
  element.className = 'panel md_dn'

  app.call('togglevalue:#' + element.id)

  assertFalse(element.classList.contains('md_dn'))
})
