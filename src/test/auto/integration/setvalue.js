test('setvalue - should set value of input element', function () {
  var expected = 'value'
  var testElement = createElement('input')
  app.call('setvalue:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.value, expected)
})