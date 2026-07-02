test('bordertop - should set border-top', function () {
  var testElement = createElement('div')
  app.call('bordertop:#' + testElement.id + ':[1px solid red]')
  assertEqual(testElement.style.borderTop, '1px solid red')
})
