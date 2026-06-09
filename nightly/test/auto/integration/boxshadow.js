test('boxshadow - should apply box shadow to the element', function () {
  var expected = 'rgba(0, 0, 0, 0.5) 0px 4px 6px 0px'
  var testElement = createElement('div')
  app.call('boxshadow:#' + testElement.id + ':[0 4px 6px rgba(0,0,0,0.5)]')
  assertStyleEqual(testElement, 'boxShadow', expected)
})