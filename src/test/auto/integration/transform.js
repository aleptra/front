test('transform - should set transform', function () {
  var testElement = createElement('div')
  app.call('transform:#' + testElement.id + ':[rotate(45deg)]')
  assertEqual(testElement.style.transform, 'rotate(45deg)')
})
