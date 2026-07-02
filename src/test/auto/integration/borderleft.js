test('borderleft - should set border-left', function () {
  var testElement = createElement('div')
  app.call('borderleft:#' + testElement.id + ':[1px solid red]')
  assertEqual(testElement.style.borderLeft, '1px solid red')
})
