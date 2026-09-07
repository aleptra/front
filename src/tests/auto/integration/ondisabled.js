test('ondisabled - should fire ondisabled when element becomes disabled', function () {
  var testElement = createElement('button')
  app.call('disable:#' + testElement.id)
  testElement.setAttribute('ondisabled', 'setvalue:[OK]')
  dom.rerun(testElement)
  assertEqual(testElement.value, 'OK')
})