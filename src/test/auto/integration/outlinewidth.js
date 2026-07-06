test('outlinewidth - should set outline-width', function () {
  var testElement = createElement('div')
  app.call('outlinewidth:#' + testElement.id + ':3px')
  assertEqual(testElement.style.outlineWidth, '3px')
})
