test('bindfield - should initialize and update a target', function () {
  var input = createElement('input')
  input.type = 'text'
  input.value = 'first'
  var target = createElement('div')
  target.textContent = 'Value: {value}'
  input.setAttribute('bindfield', 'value:#' + target.id)

  dom.rerun(input)
  assertEqual(target.textContent, 'Value: first')

  input.value = 'second'
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, keyCode: 65 }))
  assertEqual(target.textContent, 'Value: second')
})
