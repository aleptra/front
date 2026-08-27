test('screen-wide - applies the wide breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'wide'
  var element = createElement('div')
  element.setAttribute('screen-wide', 'settext:[wide]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'wide')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
