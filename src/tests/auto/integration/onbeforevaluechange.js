// app.listeners.change still has this callback commented out, so the attribute is
// parsed by nothing and has no observable behaviour yet. The case is kept as a
// placeholder so coverage appears the moment the hook is implemented.
test.skip('onbeforevaluechange - runs before the value change callback', function () {
  var target = createElement('div')
  var input = createElement('input')

  target.textContent = 'Waiting'
  input.setAttribute('onbeforevaluechange', 'settext:#' + target.id + ':[Before]')
  input.setAttribute('onvaluechange', 'settext:#' + target.id + ':[After]')
  input.value = 'typed'

  app.listeners.change('input', input, false)

  assertEqual(target.textContent, 'After')
})
