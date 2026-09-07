test('onsubmitted - is the event name mapped from the submit action', function () {
  var target = createElement('div')
  var element = createElement('form')

  target.textContent = 'Waiting'
  element.setAttribute('onsubmitted', 'settext:#' + target.id + ':[Submitted]')
  element.executed = {}

  app.element.runOnEvent({ exec: { func: 'submit', element: element } })

  assertEqual(target.textContent, 'Submitted')
})

test('onsubmitted - is not triggered by an unrelated action', function () {
  var target = createElement('div')
  var element = createElement('form')

  target.textContent = 'Waiting'
  element.setAttribute('onsubmitted', 'settext:#' + target.id + ':[Submitted]')
  element.executed = {}

  app.element.runOnEvent({ exec: { func: 'reset', element: element } })

  assertEqual(target.textContent, 'Waiting')
})
