test('select - should set the requested range', function () {
  var input = createElement('input')
  var range
  input.setSelectionRange = function (start, end) { range = [start, end] }

  dom.select(input, '1,3')

  assertEqual(range[0], '1')
  assertEqual(range[1], '3')
})
