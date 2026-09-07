test('rundelay - should schedule its action', function () {
  var target = createElement('div')
  var originalTimeout = window.setTimeout
  var delay
  window.setTimeout = function (callback, value) {
    delay = value
    callback()
  }

  app.call('rundelay[25]:settext:#' + target.id + ':[delayed]')

  window.setTimeout = originalTimeout
  assertEqual(delay, 25)
  assertEqual(target.textContent, 'delayed')
})
