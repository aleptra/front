test('settext - should set text of element', function () {
  var expected = 'text'
  var testElement = createElement('div')
  app.call('settext:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.innerText, expected)
})

test('settext - should set empty text when value is empty', function () {
  var expected = ' '
  var testElement = createElement('div')
  testElement.innerText = 'initial'
  app.call('settext:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.innerText, expected)
})

test.skip('settext - should resolve an indexed custom-element selector', function () {
  createElement('front-parser-item')
  var second = createElement('front-parser-item')

  app.call('settext:*front-parser-item[1]:[indexed]')

  assertEqual(second.textContent, 'indexed')
})

test('settext - should use the option element when no selector is provided', function () {
  var target = createElement('div')

  app.call('settext:[from-options]', { element: target })

  assertEqual(target.textContent, 'from-options')
})

test('settext - should preserve the unique call flag in parsed commands', function () {
  var parsed = app.parse.callString('settext:!#unique-target:[value]')

  assertTrue(parsed.unique)
})

test.skip('settext - should preserve semicolons inside bracket values', function () {
  var target = createElement('div')

  app.call('settext:#' + target.id + ':[one;two]')

  assertEqual(target.textContent, 'one;two')
})
