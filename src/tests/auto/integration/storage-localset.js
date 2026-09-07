test('storage-localset - writes a local value through storage-localset', function () {
  withStorage('local', 'attribute-set-local', null, function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-localset:[attribute-set-local]:[hello]')
    app.call(button.getAttribute('click'), { srcElement: button })
    assertEqual(JSON.parse(localStorage.getItem('attribute-set-local')), 'hello')
  })
})
