test('storage-sessionadd - appends to a session array through storage-sessionadd', function () {
  withStorage('session', 'attribute-array', { items: [] }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-sessionadd:[attribute-array]:[items]:[apple]')
    app.call('storage-sessionadd:[attribute-array]:[items]:[apple]', { srcElement: button })
    assertEqual(JSON.parse(sessionStorage.getItem('attribute-array')).items[0], 'apple')
  })
})
