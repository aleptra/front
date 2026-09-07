test('sanitize - should remove matching input characters', function () {
  var input = createElement('input')
  input.value = 'a1b2'

  dom.sanitize(input, '\\d')

  assertEqual(input.value, 'ab')
})
