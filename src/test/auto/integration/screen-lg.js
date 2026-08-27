test('screen-lg - applies the lg breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'lg'
  var element = createElement('div')
  element.setAttribute('screen-lg', 'settext:[lg]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'lg')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
