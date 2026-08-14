test('focus - should focus the element', function () {
  var el = createElement('input'), focused = false
  var originalTimeout = window.setTimeout

  // Mock the focus method to track whether it gets called
  el.focus = function () { focused = true }
  window.setTimeout = function (cb) { cb() }

  app.call('focus:#' + el.id)

  window.setTimeout = originalTimeout
  assertTrue(focused)
})

test.skip('focus - should run the normalized focused callback', function () {
  var target = createElement('div')
  var el = createElement('input')
  var originalTimeout = window.setTimeout
  var focused = false
  el.focus = function () { focused = true }
  el.setAttribute('onfocused', 'settext:#' + target.id + ':[focused]')
  window.setTimeout = function (cb) { cb() }

  app.call('focus:#' + el.id)

  window.setTimeout = originalTimeout
  assertTrue(focused)
  assertEqual(target.textContent, 'focused')
})