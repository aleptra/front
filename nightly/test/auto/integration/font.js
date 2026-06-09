test('font - should set font family', function () {
  var expected = '"Courier New"'
  var testElement = createElement('div')
  app.call('font:#' + testElement.id + ':[Courier New]')
  assertStyleEqual(testElement, 'fontFamily', expected)
})