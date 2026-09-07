test('confirm - should trigger with correct message', function () {
  // Mock window.confirm
  window.confirm = function (msg) {
    calledMessage = msg
  }

  var testElement = createElement('div')
  app.call('confirm:#' + testElement.id + ':[Hello World]')
  assertEqual(calledMessage, 'Hello World')
})

test('confirm - should run the true onconfirmvalue callback', function () {
  var originalConfirm = window.confirm
  var target = createElement('div')
  var element = createElement('div')
  element.setAttribute('onconfirmvalue', 'true;settext:#' + target.id + ':[confirmed]')
  window.confirm = function () { return true }

  app.call('confirm:#' + element.id + ':[Continue]')

  window.confirm = originalConfirm
  assertEqual(target.textContent, 'confirmed')
})
