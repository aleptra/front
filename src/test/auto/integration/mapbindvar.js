test('mapbindvar - should bind a mapped object value', function () {
  var element = createElement('div')
  element.textContent = '{label}'
  app.caches.set('window', 'var', 'enum', {
    data: { bindvar: { night: { label: 'Night mode' } } }
  })

  app.call('mapbindvar:#' + element.id + ':[label:night]')

  assertEqual(element.textContent, 'Night mode')
})
