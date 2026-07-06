test('outlinestyle - should set outline-style', function () {
  var testElement = createElement('div')
  app.call('outlinestyle:#' + testElement.id + ':dashed')
  assertEqual(testElement.style.outlineStyle, 'dashed')
})
