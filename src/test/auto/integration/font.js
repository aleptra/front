test('font - should set the css font shorthand', function () {
  var testElement = createElement('div')
  app.call('font:#' + testElement.id + ':[10px monospace]')
  assertStyleEqual(testElement, 'fontSize', '10px')
  assertStyleEqual(testElement, 'fontFamily', 'monospace')
})

test('font - should set a multi word family', function () {
  var testElement = createElement('div')
  app.call('font:#' + testElement.id + ':[12px Courier New]')
  assertEqual(testElement.style.fontSize, '12px')
  // The browser normalises a multi word family to a quoted string.
  assertEqual(testElement.style.fontFamily, '"Courier New"')
})

test('font - should accept weight and line height', function () {
  var testElement = createElement('div')
  app.call('font:#' + testElement.id + ':[bold 12px/1.5 monospace]')
  assertEqual(testElement.style.fontWeight, 'bold')
  assertEqual(testElement.style.fontSize, '12px')
  assertEqual(testElement.style.lineHeight, '1.5')
  assertEqual(testElement.style.fontFamily, 'monospace')
})

test('font - should work as an attribute', function () {
  var testElement = createElement('div')
  testElement.setAttribute('font', '11px monospace')
  app.attributes.run([testElement])
  assertStyleEqual(testElement, 'fontSize', '11px')
  assertStyleEqual(testElement, 'fontFamily', 'monospace')
})

test('font - resets the other font longhands like the css shorthand does', function () {
  var testElement = createElement('div')
  testElement.style.fontWeight = 'bold'
  testElement.style.lineHeight = '2'

  app.call('font:#' + testElement.id + ':[10px monospace]')

  assertEqual(testElement.style.fontWeight, 'normal')
  assertEqual(testElement.style.lineHeight, 'normal')
})

test('font - should accept a family without a size', function () {
  var testElement = createElement('div')
  testElement.setAttribute('font', 'Arial')
  app.attributes.run([testElement])

  assertEqual(testElement.style.font, '100% Arial')
  assertStyleEqual(testElement, 'fontFamily', 'Arial')
})

test('font - should accept a css shorthand as an attribute', function () {
  var testElement = createElement('div')
  testElement.setAttribute('font', '10px Arial')
  app.attributes.run([testElement])

  assertStyleEqual(testElement, 'fontSize', '10px')
  assertStyleEqual(testElement, 'fontFamily', 'Arial')
})

test('font - should accept a multi word family in css order', function () {
  var testElement = createElement('div')
  testElement.setAttribute('font', '12px Courier New')
  app.attributes.run([testElement])

  assertEqual(testElement.style.fontSize, '12px')
  assertEqual(testElement.style.fontFamily, '"Courier New"')
})

test('font - should accept css-order line height', function () {
  var testElement = createElement('div')
  app.call('font:#' + testElement.id + ':[10px/1.5 Arial]')

  assertEqual(testElement.style.fontSize, '10px')
  assertEqual(testElement.style.lineHeight, '1.5')
  assertEqual(testElement.style.fontFamily, 'Arial')
})
