test('format - should remove repeated operators from statevalue', function () {
  var controller = createElement('button')
  var input = createElement('input')
  input.setAttribute('statevalue', '1++2')
  controller.value = 'compute'
  controller.clicked = input

  dom.format(controller)

  assertEqual(input.attributes.statevalue.value, '1+2')
})
