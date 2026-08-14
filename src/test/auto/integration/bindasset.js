test('bindasset - should bind a cached nested value', function () {
  app.caches.set('session', 'var', 'profile', { data: { name: 'Alice' } })
  var target = createElement('div')
  target.textContent = 'User: {name}'
  target.setAttribute('bindasset', 'name:profile.name')

  dom.rerun(target)

  assertEqual(target.textContent, 'User: Alice')
})
