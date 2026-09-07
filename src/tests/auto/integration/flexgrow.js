test('flexgrow - should set flex-grow', function () {
  var expected = '2'
  var testElement = createElement('div')
  app.call('flexgrow:#' + testElement.id + ':[2]')
  assertStyleEqual(testElement, 'flex-grow', expected)
})
