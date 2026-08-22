test('unset - should unset style property in element', function () {
  var testElement = createElement('div')
  testElement.style.color = 'red'
  app.call('unset:#' + testElement.id + ':[color]')
  assertEqual(testElement.style.color, 'unset')
})