test('setattr - should set custom attribute', function () {
  var expected = true
  var testElement = createElement('div')
  app.call('setattr:#' + testElement.id + ':[data-test]')
  assertEqual(testElement.hasAttribute('data-test'), expected)
})

test('setattr - should set custom attribute with value', function () {
  var expected = 'value'
  var testElement = createElement('div')
  app.call('setattr:#' + testElement.id + ':[new-attribute][value]')
  assertEqual(testElement.getAttribute('new-attribute'), expected)
})