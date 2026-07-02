test('doctitle - should set document title', function () {
  var testElement = createElement('div')
  app.call('doctitle:#' + testElement.id + ':[Test Title]')
  assertEqual(document.title, 'Test Title')
})
