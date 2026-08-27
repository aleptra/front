test('screen-xxs - applies the xxs breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'xxs'
  var element = createElement('div')
  element.setAttribute('screen-xxs', 'settext:[xxs]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'xxs')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
