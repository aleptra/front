test('onconfirm - runs after the confirm action', function () {
  var target = createElement('div')
  var element = createElement('button')

  target.textContent = 'Waiting'
  element.setAttribute('confirm', 'Proceed?')
  element.setAttribute('onconfirm', 'settext:#' + target.id + ':[Confirm shown]')

  withProperty(window, 'confirm', function () { return true }, function () {
    app.attributes.run([element])
  })

  assertEqual(target.textContent, 'Confirm shown')
})
