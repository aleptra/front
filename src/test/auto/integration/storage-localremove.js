test('storage-localremove - removes a local key through storage-localremove', function () {
  withStorage('local', 'attribute-remove-local', 'value', function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-localremove:[attribute-remove-local]')
    app.call(button.getAttribute('click'), { srcElement: button })
    assertEqual(localStorage.getItem('attribute-remove-local'), null)
  })
})
