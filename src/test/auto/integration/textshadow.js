test('textshadow - should apply text shadow to element', function () {
  var expected = 'rgba(0, 0, 0, 0.5) 2px 2px 4px'
  var testElement = createElement('div')
  app.call('textshadow:#' + testElement.id + ':[2px 2px 4px rgba(0,0,0,0.5)]')
  assertStyleEqual(testElement, 'textShadow', expected)
})