test('disable - should disable element', function () {
  var testElement = createElement('button')
  app.call('disable:#' + testElement.id)
  assertTrue(testElement.disabled)
})
