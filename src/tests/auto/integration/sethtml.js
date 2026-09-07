test('sethtml - should set html of element', function () {
  var expected = '<b>html</b>'
  var testElement = createElement('div')
  app.call('sethtml:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.innerHTML, expected)
})

test('sethtml - should apply italic style to child element', function () {
  var expected = 'italic'
  var testElement = createElement('div')
  app.call('sethtml:#' + testElement.id + ':[<i>html</i>]')
  assertStyleEqual(testElement.childNodes[0], 'fontStyle', expected)
})