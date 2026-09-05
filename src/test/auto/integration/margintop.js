test('margintop - should set top margin', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('margintop:#' + testElement.id + ':[10px]')
  assertStyleEqual(testElement, 'marginTop', expected)
})


test('margintop - should add px to a bare number', function () {
  var expected = '10px'
  var testElement = createElement('div')
  app.call('margintop:#' + testElement.id + ':[10]')
  assertStyleEqual(testElement, 'marginTop', expected)
})

test('margintop - should add px to a negative bare number', function () {
  var expected = '-10px'
  var testElement = createElement('div')
  app.call('margintop:#' + testElement.id + ':[-10]')
  assertStyleEqual(testElement, 'marginTop', expected)
})
