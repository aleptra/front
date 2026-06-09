test('paddingtop - should set top padding on element', function () {
  var expected = '5px'
  var testElement = createElement('div')
  app.call('paddingtop:#' + testElement.id + ':[5px]')
  assertStyleEqual(testElement, 'paddingTop', expected)
})