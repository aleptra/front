// The matching branch in app.listeners.change is commented out, so this attribute
// currently has no runtime effect. Kept as a placeholder for the implementation.
test.skip('onaftervaluechange - runs after the value change callback', function () {
  var target = createElement('div')
  var input = createElement('input')

  target.textContent = 'Waiting'
  input.setAttribute('onvaluechange', 'settext:#' + target.id + ':[Changed]')
  input.setAttribute('onaftervaluechange', 'settext:#' + target.id + ':[After]')
  input.value = 'typed'

  app.listeners.change('input', input, false)

  assertEqual(target.textContent, 'After')
})
