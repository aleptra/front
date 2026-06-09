test('hide - should make visible element hidden', function () {
  var testElement = createElement('div')
  testElement.style.display = 'block'

  // Call your hide function
  app.call('hide:#' + testElement.id)

  // Assert the element is now hidden
  assertStyleEqual(testElement, 'display', 'none')
})