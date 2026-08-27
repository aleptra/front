test('storage-sessionset - writes a session value through storage-sessionset', function () {
  withStorage('session', 'attribute-set', null, function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-sessionset:[attribute-set]:[hello]')
    app.call(button.getAttribute('click'), { srcElement: button })
    assertEqual(JSON.parse(sessionStorage.getItem('attribute-set')), 'hello')
  })
})
