test('maprun - should execute the mapped action', function () {
  var element = createElement('div')
  app.caches.set('window', 'var', 'enum', {
    data: { run: { finish: 'settext:#' + element.id + ':[Finished]' } }
  })

  app.call('maprun:#' + element.id + ':[finish]')

  assertEqual(element.textContent, 'Finished')
})
