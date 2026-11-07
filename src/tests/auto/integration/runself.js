test('runself - runs attributes on specific selector', function () {
  var element = createElement('div')
  element.id = 'runself-test'
  element.setAttribute('settext', 'selector-text')

  app.element.saveOriginalValues(element)

  // runself runs app.attributes.run with the selector
  dom.runself(element, '#runself-test')

  assertEqual(element.textContent, 'selector-text')
})
