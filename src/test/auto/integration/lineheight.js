test('lineheight - should set line height', function () {
  var expected = '16px'
  var testElement = createElement('div')
  app.call('lineheight:#' + testElement.id + ':[1rem]')
  assertStyleEqual(testElement, 'lineHeight', expected)
})

test('lineheight - should keep a bare number unitless', function () {
  var testElement = createElement('div')
  app.call('lineheight:#' + testElement.id + ':[2]')
  assertEqual(testElement.style.lineHeight, '2')
})

test('lineheight - should keep a decimal unitless', function () {
  var testElement = createElement('div')
  app.call('lineheight:#' + testElement.id + ':[1.5]')
  assertEqual(testElement.style.lineHeight, '1.5')
})

test('lineheight - should multiply the font size when unitless', function () {
  var testElement = createElement('div')
  testElement.style.fontSize = '10px'
  app.call('lineheight:#' + testElement.id + ':[2]')
  assertStyleEqual(testElement, 'lineHeight', '20px')
})
