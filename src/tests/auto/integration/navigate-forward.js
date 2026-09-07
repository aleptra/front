test('navigate-forward - calls history forward through navigate-forward', function () {
  var called = false
  withStub(window.history, 'forward', function () { called = true }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'navigate-forward')
    app.call(button.getAttribute('click'), { srcElement: button })
  })
  assertTrue(called)
})
