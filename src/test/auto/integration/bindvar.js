test('bindvar - should bind variable value to element text', function () {
  var testElement = createElement('div')
  testElement.textContent = 'Hello {name}'
  testElement.setAttribute('bindvar', 'name:World')
  dom.rerun(testElement)
  assertEqual(testElement.textContent, 'Hello World')
})
