test('onhide - should fire onhide when element runs hide', function () {
  var testElement = createElement('div')

  testElement.setAttribute('hide', '')
  testElement.setAttribute('onhide', 'settext:[OK]')
  dom.rerun(testElement)

  assertEqual(testElement.innerText, 'OK')
})