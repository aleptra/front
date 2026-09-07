test('onunselected - runs on the field that loses the selection', function () {
  var target = createElement('div')
  var previous = createElement('input')
  var next = createElement('input')

  target.textContent = 'Waiting'
  previous.type = 'radio'
  previous.setAttribute('selected', 'true')
  previous.setAttribute('onunselected', 'settext:#' + target.id + ':[Deselected]')

  next.type = 'radio'
  next.setAttribute('onselectchange', 'focus:#' + next.id)

  // Only the radio under test may hold the selection when the handler runs.
  var stray = document.querySelectorAll('input[type="radio"][selected="true"]')
  for (var i = 0; i < stray.length; i++) {
    if (stray[i] !== previous) stray[i].removeAttribute('selected')
  }

  try {
    app.listeners.change('input', next, false)

    assertEqual(target.textContent, 'Deselected')
    assertEqual(previous.getAttribute('selected'), null)
    assertEqual(next.getAttribute('selected'), 'true')
  } finally {
    previous.removeAttribute('selected')
    next.removeAttribute('selected')
  }
})
