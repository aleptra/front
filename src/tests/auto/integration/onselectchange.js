test('onselectchange - runs the callback and marks the field selected', function () {
  var target = createElement('div')
  var radio = createElement('input')

  target.textContent = 'Waiting'
  radio.type = 'radio'
  radio.setAttribute('onselectchange', 'settext:#' + target.id + ':[Selection changed]')

  // Clear selection state left by other fixtures: the handler looks the
  // previously selected radio up across the whole document.
  var stray = document.querySelectorAll('input[type="radio"][selected="true"]')
  for (var i = 0; i < stray.length; i++) stray[i].removeAttribute('selected')

  try {
    app.listeners.change('input', radio, false)

    assertEqual(target.textContent, 'Selection changed')
    assertEqual(radio.getAttribute('selected'), 'true')
  } finally {
    radio.removeAttribute('selected')
  }
})
