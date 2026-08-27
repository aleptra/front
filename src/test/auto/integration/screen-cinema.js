test('screen-cinema - applies the cinema breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'cinema'
  var element = createElement('div')
  element.setAttribute('screen-cinema', 'settext:[cinema]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'cinema')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
