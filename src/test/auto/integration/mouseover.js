test('mouseover - should fire mouseover handler', function () {
  var testElement = createElement('div')
  testElement.setAttribute('mouseover', 'settext:[hovered]')
  app.attributes.run('#' + testElement.id)
  testElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  assertEqual(testElement.textContent, 'hovered')
})
