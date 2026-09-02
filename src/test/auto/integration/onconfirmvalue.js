test('onconfirmvalue - runs the mapped action when the dialog is accepted', function () {
  var target = createElement('div')
  var element = createElement('button')

  target.textContent = 'Waiting'
  element.setAttribute('confirm', 'Proceed?')
  element.setAttribute('onconfirmvalue', 'true;settext:#' + target.id + ':[Accepted]')

  withProperty(window, 'confirm', function () { return true }, function () {
    app.attributes.run([element])
  })

  assertEqual(target.textContent, 'Accepted')
})

test('onconfirmvalue - stays silent when the dialog is dismissed', function () {
  var target = createElement('div')
  var element = createElement('button')

  target.textContent = 'Waiting'
  element.setAttribute('confirm', 'Proceed?')
  element.setAttribute('onconfirmvalue', 'true;settext:#' + target.id + ':[Accepted]')

  withProperty(window, 'confirm', function () { return false }, function () {
    app.attributes.run([element])
  })

  assertEqual(target.textContent, 'Waiting')
})
