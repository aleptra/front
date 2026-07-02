test('bindquery - should bind query parameter value to element text', function () {
  // Simulate a query param via app.querystrings.get
  var original = app.querystrings.get
  app.querystrings.get = function (a, key) { return key === 'user' ? 'Josef' : '' }

  var testElement = createElement('div')
  testElement.textContent = 'Hello {name}'
  testElement.setAttribute('bindquery', 'name:user')
  dom.rerun(testElement)

  assertEqual(testElement.textContent, 'Hello Josef')
  app.querystrings.get = original
})
