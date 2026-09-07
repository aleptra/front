test('onsethtml - should fire onsethtml after sethtml action', function () {
  var testElement = createElement('div')
  testElement.setAttribute('onsethtml', 'setattr:#' + testElement.id + ':[data-fired][yes]')
  app.attributes.run('#' + testElement.id)
  app.call('sethtml:#' + testElement.id + ':[<span>hi</span>]')
  assertEqual(testElement.getAttribute('data-fired'), 'yes')
})
