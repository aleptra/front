test('screen-mega - applies the mega breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'mega'
  var element = createElement('div')
  element.setAttribute('screen-mega', 'settext:[mega]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'mega')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
