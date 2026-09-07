test('bgimage - should set background image', function () {
  var expected = 'url("https://placehold.co/200x100")'
  var testElement = createElement('div')
  app.call('bgimage:#' + testElement.id + ':[https://placehold.co/200x100]')
  assertStyleEqual(testElement, 'backgroundImage', expected)
})

test('bgimage - should not treat a shade like filename as a colour', function () {
  var testElement = createElement('div')
  testElement.setAttribute('bgimage', 'black01.png 16px no-repeat 10px')
  app.attributes.run([testElement])

  // The shade expansion must stay out of image paths.
  assertContains(testElement.style.backgroundImage, 'black01.png')
})

test('bgimage - should set size, repeat and position from a four part value', function () {
  var testElement = createElement('div')
  app.call('bgimage:#' + testElement.id + ':[pic.png 16px no-repeat 10px]')

  // The value is split on spaces as url, size, repeat, position.
  assertEqual(testElement.style.backgroundImage, 'url("pic.png")')
  assertEqual(testElement.style.backgroundSize, '16px auto')
  assertEqual(testElement.style.backgroundRepeat, 'no-repeat')
  assertEqual(testElement.style.backgroundPosition, '10px center')
})

test('bgimage - should accept keyword size and position', function () {
  var testElement = createElement('div')
  app.call('bgimage:#' + testElement.id + ':[pic.png cover repeat center]')

  assertEqual(testElement.style.backgroundSize, 'cover')
  assertEqual(testElement.style.backgroundRepeat, 'repeat')
  assertEqual(testElement.style.backgroundPosition, 'center center')
})

test('bgimage - should leave the other properties untouched for a url only value', function () {
  var testElement = createElement('div')
  app.call('bgimage:#' + testElement.id + ':[pic.png]')

  assertEqual(testElement.style.backgroundImage, 'url("pic.png")')
  assertEqual(testElement.style.backgroundSize, '')
  assertEqual(testElement.style.backgroundRepeat, '')
  assertEqual(testElement.style.backgroundPosition, '')
})

test('bgimage - should work as an attribute', function () {
  var testElement = createElement('div')
  testElement.setAttribute('bgimage', 'pic.png 100% no-repeat top')
  app.attributes.run([testElement])

  assertEqual(testElement.style.backgroundImage, 'url("pic.png")')
  assertEqual(testElement.style.backgroundSize, '100% auto')
  assertEqual(testElement.style.backgroundRepeat, 'no-repeat')
  // A single vertical keyword normalises to "center top".
  assertEqual(testElement.style.backgroundPosition, 'center top')
})

test('bgimage - should keep a path with directories intact', function () {
  var testElement = createElement('div')
  app.call('bgimage:#' + testElement.id + ':[/assets/img/logo.png 32px no-repeat left]')

  assertEqual(testElement.style.backgroundImage, 'url("/assets/img/logo.png")')
  assertEqual(testElement.style.backgroundSize, '32px auto')
})
