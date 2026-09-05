test('initial - should set style property to initial', function () {
  var testElement = createElement('div')
  testElement.style.color = 'red'
  app.call('initial:#' + testElement.id + ':[color]')
  assertEqual(testElement.style.color, 'initial')
})

test('initial - should work as an attribute', function () {
  var testElement = createElement('div')
  testElement.style.display = 'flex'
  testElement.setAttribute('initial', 'display')
  app.attributes.run([testElement])
  assertEqual(testElement.style.display, 'initial')
})
