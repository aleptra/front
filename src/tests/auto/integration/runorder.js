test('runorder - should execute attributes in order', function () {
  var expected = 'RUN'
  var testElement = createElement('span')
  app.call('settext:#' + testElement.id + ':[' + expected + '];lowercase:#' + testElement.id + ';uppercase:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})

test('runorder - controls action order', function () {
  var element = createElement('div')
  element.setAttribute('settext', 'first')
  element.setAttribute('sethtml', '<b>second</b>')
  element.setAttribute('runorder', 'settext;sethtml')

  app.attributes.run([element])

  assertEqual(element.innerHTML, '<b>second</b>').desc('ordered actions executed')
})
