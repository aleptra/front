test('textshadow - should apply text shadow to element', function () {
  var expected = 'rgba(0, 0, 0, 0.5) 2px 2px 4px'
  var testElement = createElement('div')
  app.call('textshadow:#' + testElement.id + ':[2px 2px 4px rgba(0,0,0,0.5)]')
  assertStyleEqual(testElement, 'textShadow', expected)
})


test('textshadow - should expand a shade shorthand inside the shadow value', function () {
  var testElement = createElement('div')
  testElement.setAttribute('textshadow', '0 1px 2px black07')
  app.attributes.run([testElement])
  assertContains(testElement.style.textShadow, 'rgba(0, 0, 0, 0.7)')
})
