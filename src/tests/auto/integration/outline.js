test('outline - should set outline style', function () {
  var testElement = createElement('div')
  app.call('outline:#' + testElement.id + ':[2px solid red]')
  assertStyleEqual(testElement, 'outlineWidth', '2px')
  assertStyleEqual(testElement, 'outlineStyle', 'solid')
  assertStyleEqual(testElement, 'outlineColor', 'rgb(255, 0, 0)')
})
