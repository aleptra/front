test('bindglobal - should bind global variable to element text', function () {
  app.globals = app.globals || {}
  app.globals.testVar = 'globalValue'
  var testElement = createElement('div')
  testElement.textContent = '{testVar}'
  testElement.setAttribute('bindglobal', 'testVar:testVar')
  dom.rerun(testElement)
  assertEqual(testElement.textContent, 'globalValue')
})
