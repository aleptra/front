test('storage-sessionupdate - updates a session value through storage-sessionupdate', function () {
  withStorage('session', 'attribute-update', { profile: { role: 'user' } }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-sessionupdate:[attribute-update]:[profile]:[role]:[admin]')
    app.call('storage-sessionupdate:[attribute-update]:[profile]:[role]:[admin]', { srcElement: button })
    assertEqual(JSON.parse(sessionStorage.getItem('attribute-update')).profile.role, 'admin')
  })
})
