test('placeholder - should set placeholder text on div element', function () {
  var testElement = createElement('div')
  testElement.setAttribute('placeholder', 'Enter text')
  dom.rerun(testElement)
  assertEqual(testElement.textContent, 'Enter text')
})
