test('setid - should set id attribute of element', function () {
  var expected = 'id'
  var testElement = createElement('div')
  app.call('setid:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.getAttribute('id'), expected)
})