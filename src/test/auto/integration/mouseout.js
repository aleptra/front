test('mouseout - should fire mouseout handler', function () {
  var testElement = createElement('div')
  testElement.setAttribute('mouseout', 'settext:[left]')
  app.attributes.run('#' + testElement.id)
  testElement.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
  assertEqual(testElement.textContent, 'left')
})
