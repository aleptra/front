test('setmax - should set max attribute on element', function () {
  var expected = '100'
  var testElement = createElement('progress')

  app.call('setmax:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.getAttribute('max'), expected)
})