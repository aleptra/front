test('letterspacing - should set letter-spacing', function () {
  var expected = '2px'
  var testElement = createElement('div')
  app.call('letterspacing:#' + testElement.id + ':[2px]')
  assertStyleEqual(testElement, 'letter-spacing', expected)
})
