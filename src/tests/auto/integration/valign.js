test('valign - should set vertical alignment in element', function () {
  var testElement = createElement('div')
  app.call('valign:#' + testElement.id + ':[middle]')
  assertStyleEqual(testElement, 'verticalAlign', 'middle')
})
