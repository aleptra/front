test('storage-sessionremove - removes a session key through storage-sessionremove', function () {
  withStorage('session', 'attribute-remove', 'value', function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-sessionremove:[attribute-remove]')
    app.call(button.getAttribute('click'), { srcElement: button })
    assertEqual(sessionStorage.getItem('attribute-remove'), null)
  })
})
