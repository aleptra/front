test('alert - should trigger with correct message', function () {
  // Mock window.alert
  window.alert = function (msg) {
    calledMessage = msg
  }

  var testElement = createElement('div')
  app.call('alert:#' + testElement.id + ':[Hello World]')
  assertEqual(calledMessage, 'Hello World')
})