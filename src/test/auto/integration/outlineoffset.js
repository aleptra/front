test('outlineoffset - should set outline-offset', function () {
  var testElement = createElement('div')
  app.call('outlineoffset:#' + testElement.id + ':5px')
  assertEqual(testElement.style.outlineOffset, '5px')
})
