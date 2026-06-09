test('onshow - should fire onshow when element runs show', function () {
  var testElement = createElement('div')

  testElement.setAttribute('show', '')
  testElement.setAttribute('onshow', 'settext:[OK]')
  dom.rerun(testElement)

  assertEqual(testElement.innerText, 'OK')
})