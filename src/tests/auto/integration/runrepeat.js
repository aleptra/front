test('runrepeat - should schedule its action', function () {
  var target = createElement('div')
  var originalInterval = window.setInterval
  var interval
  window.setInterval = function (callback, value) {
    interval = value
    callback()
    return 1
  }

  app.call('runrepeat[30]:settext:#' + target.id + ':[repeated]')

  window.setInterval = originalInterval
  assertEqual(interval, 30)
  assertEqual(target.textContent, 'repeated')
})
