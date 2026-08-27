test('storage-localupdate - updates a local value through storage-localupdate', function () {
  withStorage('local', 'attribute-update-local', { profile: { role: 'user' } }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-localupdate:[attribute-update-local]:[profile]:[role]:[admin]')
    app.call(button.getAttribute('click'), { srcElement: button })
    assertEqual(JSON.parse(localStorage.getItem('attribute-update-local')).profile.role, 'admin')
  })
})
