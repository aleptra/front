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
