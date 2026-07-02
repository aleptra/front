test('borderright - should set border-right', function () {
  var testElement = createElement('div')
  app.call('borderright:#' + testElement.id + ':[1px solid red]')
  assertEqual(testElement.style.borderRight, '1px solid red')
})
