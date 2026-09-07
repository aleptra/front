test('onblur - runs after the blur action', function () {
  var target = createElement('div')
  var element = createElement('input')

  target.textContent = 'Waiting'
  element.setAttribute('blur', '')
  element.setAttribute('onblur', 'settext:#' + target.id + ':[Blurred]')

  app.attributes.run([element])

  assertEqual(target.textContent, 'Blurred')
})
