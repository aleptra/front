test('setvalue - should set value of input element', function () {
  var expected = 'value'
  var testElement = createElement('input')
  app.call('setvalue:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.value, expected)
})

test('setvalue - should run the onvaluechange callback', function () {
  var target = createElement('div')
  var input = createElement('input')
  input.setAttribute('onvaluechange', 'settext:#' + target.id + ':[value-changed]')

  app.call('setvalue:#' + input.id + ':[updated]')

  assertEqual(target.textContent, 'value-changed')
})

test('setvalue - should run the onstatevaluechange callback', function () {
  var target = createElement('div')
  var input = createElement('input')
  input.setAttribute('onstatevaluechange', 'settext:#' + target.id + ':[state-changed]')

  app.listeners.change('input', input, false)

  assertEqual(target.textContent, 'state-changed')
})

test('setvalue - should update radio selection through onselectchange', function () {
  var selectedTarget = createElement('div')
  var unselectedTarget = createElement('div')
  var previous = createElement('input')
  var current = createElement('input')
  previous.type = 'radio'
  current.type = 'radio'
  previous.setAttribute('selected', 'true')
  previous.setAttribute('onunselected', 'settext:#' + unselectedTarget.id + ':[unselected]')
  current.setAttribute('onselectchange', 'settext:#' + selectedTarget.id + ':[selected]')

  app.listeners.change('change', current, false)

  assertEqual(selectedTarget.textContent, 'selected')
  assertEqual(unselectedTarget.textContent, 'unselected')
  assertTrue(!previous.hasAttribute('selected'))
  assertEqual(current.getAttribute('selected'), 'true')
})
