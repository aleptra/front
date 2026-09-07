test('onfocused - runs after the focus action', function () {
  var target = createElement('div')
  var element = createElement('input')

  target.textContent = 'Waiting'
  element.setAttribute('focus', '')
  element.setAttribute('onfocused', 'settext:#' + target.id + ':[Focused]')

  app.attributes.run([element])

  assertEqual(target.textContent, 'Focused')
})
