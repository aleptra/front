test('enable - should enable a disabled element', function () {
  var testElement = createElement('button')
  testElement.disabled = true
  app.call('enable:#' + testElement.id)
  assertFalse(testElement.disabled)
})
