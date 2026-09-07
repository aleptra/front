test('storage-localadd - appends to a local array through storage-localadd', function () {
  withStorage('local', 'attribute-array-local', { items: [] }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'storage-localadd:[attribute-array-local]:[items]:[apple]')
    app.call('storage-localadd:[attribute-array-local]:[items]:[apple]', { srcElement: button })
    assertEqual(JSON.parse(localStorage.getItem('attribute-array-local')).items[0], 'apple')
  })
})
