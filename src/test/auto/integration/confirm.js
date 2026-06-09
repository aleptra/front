test('confirm - should trigger with correct message', function () {
  // Mock window.confirm
  window.confirm = function (msg) {
    calledMessage = msg
  }

  var testElement = createElement('div')
  app.call('confirm:#' + testElement.id + ':[Hello World]')
  assertEqual(calledMessage, 'Hello World')
})