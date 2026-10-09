test('bindfield - should initialize and update a target', function () {
  var input = createElement('input')
  input.type = 'text'
  input.value = 'first'
  var target = createElement('div')
  target.textContent = 'Value: {value}'
  input.setAttribute('bindfield', 'value:#' + target.id)

  dom.rerun(input)
  assertEqual(target.textContent, 'Value: first')

  input.value = 'second'
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, keyCode: 65 }))
  assertEqual(target.textContent, 'Value: second')
})

test('bindfield - onbindfield handler is called on field keyup', function () {
  var input = createElement('input')
  input.type = 'text'
  input.value = 'initial'

  var handlerCalled = false
  var originalCall = app.call
  app.call = function (call, exec) {
    if (call === 'log("field changed")') {
      handlerCalled = true
    }
    return originalCall.call(app, call, exec)
  }

  input.setAttribute('bindfield', 'value:#dummy')
  input.setAttribute('onbindfield', 'log("field changed")')

  try {
    dom.rerun(input)

    // Trigger field change
    input.value = 'changed'
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, keyCode: 65 }))

    assertTrue(handlerCalled).desc('onbindfield handler is called when field value changes')

  } finally {
    app.call = originalCall
  }
})
