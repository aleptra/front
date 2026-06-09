test('focus - should focus the element', function () {
  var el = createElement('input'), focused = false

  // Mock the focus method to track whether it gets called
  el.focus = function () { focused = true }
  window.setTimeout = function (cb) { cb() }

  app.call('focus:#' + el.id)
  assertTrue(focused)
})