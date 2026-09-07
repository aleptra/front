test('screen-xl - applies the xl breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'xl'
  var element = createElement('div')
  element.setAttribute('screen-xl', 'settext:[xl]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'xl')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
