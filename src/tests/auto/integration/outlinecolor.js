test('outlinecolor - should set outline-color', function () {
  var testElement = createElement('div')
  app.call('outlinecolor:#' + testElement.id + ':[red]')
  assertEqual(testElement.style.outlineColor, 'red')
})


test('outlinecolor - should map the shade shorthands to rgba', function () {
  var testElement = createElement('div')
  testElement.setAttribute('outlinecolor', 'white02')
  app.attributes.run([testElement])
  assertStyleEqual(testElement, 'outlineColor', 'rgba(255, 255, 255, 0.2)')
})
