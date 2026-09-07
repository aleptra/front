test('cursor - should set cursor style', function () {
  var testElement = createElement('div')
  app.call('cursor:#' + testElement.id + ':[pointer]')
  assertStyleEqual(testElement, 'cursor', 'pointer')
})