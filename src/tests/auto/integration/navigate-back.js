test('navigate-back - calls history back through navigate-back', function () {
  var called = false
  withStub(window.history, 'back', function () { called = true }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'navigate-back')
    app.call(button.getAttribute('click'), { srcElement: button })
  })
  assertTrue(called)
})
