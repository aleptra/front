test('relative - should set position to relative', function () {
  var testElement = createElement('div')
  app.call('relative:#' + testElement.id)
  assertStyleEqual(testElement, 'position', 'relative')
})
