test('reset - should restore an input value', function () {
  var input = createElement('input')
  input.value = 'original'
  app.element.saveOriginalValues(input)
  input.value = 'changed'

  dom.reset(input)

  assertEqual(input.value, 'original')
})
