test('inherit - should set style property to inherit', function () {
  var testElement = createElement('div')
  app.call('inherit:#' + testElement.id + ':[color]')
  assertEqual(testElement.style.color, 'inherit')
})
