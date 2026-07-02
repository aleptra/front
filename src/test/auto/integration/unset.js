test('unset - should set style property to unset', function () {
  var testElement = createElement('div')
  testElement.style.color = 'red'
  app.call('unset:#' + testElement.id + ':[color]')
  assertEqual(testElement.style.color, 'unset')
})
