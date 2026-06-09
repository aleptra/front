test('bgimage - should set background image', function () {
  var expected = 'url("https://placehold.co/200x100")'
  var testElement = createElement('div')
  app.call('bgimage:#' + testElement.id + ':[https://placehold.co/200x100]')
  assertStyleEqual(testElement, 'backgroundImage', expected)
})