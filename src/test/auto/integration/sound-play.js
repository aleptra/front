test('sound-play - dispatches the experimental sound-play attribute', function () {
  var called = false
  withStub(app.module.sound, 'play', function (element) { called = element }, function () {
    var element = createElement('button')
    element.setAttribute('sound-play', '')
    app.call('rerun', { element: element })
    assertEqual(called, element)
  })
})
