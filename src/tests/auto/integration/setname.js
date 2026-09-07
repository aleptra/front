test('setname - should set name attribute of element', function () {
  var expected = 'name'
  var testElement = createElement('input')
  app.call('setname:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.getAttribute('name'), expected)
})