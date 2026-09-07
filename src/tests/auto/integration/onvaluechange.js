test('onvaluechange - runs when the field value changes', function () {
  var target = createElement('div')
  var input = createElement('input')

  target.textContent = 'Waiting'
  input.setAttribute('onvaluechange', 'settext:#' + target.id + ':[Value changed]')
  input.value = 'typed'

  app.listeners.change('input', input, false)

  assertEqual(target.textContent, 'Value changed')
})

test('onvaluechange - is not required on a field', function () {
  var input = createElement('input')
  input.value = 'typed'

  app.listeners.change('input', input, false)

  assertEqual(input.value, 'typed')
})
