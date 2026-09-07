test('maptext - should map text from enum data', function () {
  app.caches.set('window', 'var', 'enum', { data: { text: { greeting: 'Hello' } } })
  var element = createElement('div')

  app.call('maptext:#' + element.id + ':[greeting]')

  assertEqual(element.textContent, 'Hello')
})
