test('onenabled - should fire onenabled when element becomes enabled', function () {
  var testElement = createElement('button')
  testElement.setAttribute('enable', '')
  app.call('enable:#' + testElement.id)
  testElement.setAttribute('onenabled', 'setvalue:[OK]')
  dom.rerun(testElement)
  assertEqual(testElement.value, 'OK')
})