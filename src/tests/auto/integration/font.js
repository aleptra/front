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

test('font - should work as an attribute', function () {
  var testElement = createElement('div')
  testElement.setAttribute('font', '11px monospace')
  app.attributes.run([testElement])
  assertStyleEqual(testElement, 'fontSize', '11px')
  assertStyleEqual(testElement, 'fontFamily', 'monospace')
})

test('font - should accept a css shorthand as an attribute', function () {
  var testElement = createElement('div')
  testElement.setAttribute('font', '10px Arial')
  app.attributes.run([testElement])

  assertStyleEqual(testElement, 'fontSize', '10px')
  assertStyleEqual(testElement, 'fontFamily', 'Arial')
})
