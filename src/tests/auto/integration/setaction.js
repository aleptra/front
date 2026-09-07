test('setaction - should set value of action attribute on element', function () {
  var expected = 'url'
  var testElement = createElement('form')

  app.call('setaction:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.getAttribute('action'), expected)
})