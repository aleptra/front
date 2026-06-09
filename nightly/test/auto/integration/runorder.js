test('runorder - should execute attributes in order', function () {
  var expected = 'RUN'
  var testElement = createElement('span')
  app.call('settext:#' + testElement.id + ':[' + expected + '];lowercase:#' + testElement.id + ';uppercase:#' + testElement.id)
  assertEqual(testElement.innerText, expected)
})