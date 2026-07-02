test('borderbottom - should set border-bottom', function () {
  var testElement = createElement('div')
  app.call('borderbottom:#' + testElement.id + ':[1px solid red]')
  assertEqual(testElement.style.borderBottom, '1px solid red')
})
