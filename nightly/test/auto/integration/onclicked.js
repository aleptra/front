test('onclicked - should fire onclicked when element is clicked', function () {
  var testElement = createElement('button')
  testElement.setAttribute('onclicked', 'settext:[OK]')
  app.attributes.run('#' + testElement.id)
  app.call('click:#' + testElement.id)
  assertEqual(testElement.textContent, 'OK')
})