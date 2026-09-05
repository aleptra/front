test('width - should set element width', function () {
  var expected = '400px'
  var testElement = createElement('div')
  app.call('width:#' + testElement.id + ':[400px]')
  assertStyleEqual(testElement, 'width', expected)
})


test('width - should add px to a bare number', function () {
  var expected = '400px'
  var testElement = createElement('div')
  app.call('width:#' + testElement.id + ':[400]')
  assertStyleEqual(testElement, 'width', expected)
})

test('width - should add px to a decimal bare number', function () {
  var expected = '1.5px'
  var testElement = createElement('div')
  app.call('width:#' + testElement.id + ':[1.5]')
  assertStyleEqual(testElement, 'width', expected)
})

test('width - should keep a percentage untouched', function () {
  var expected = '50%'
  var testElement = createElement('div')
  app.call('width:#' + testElement.id + ':[50%]')
  assertStyleEqual(testElement, 'width', expected)
})
