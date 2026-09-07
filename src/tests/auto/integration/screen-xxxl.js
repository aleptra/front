test('screen-xxxl - applies the xxxl breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'xxxl'
  var element = createElement('div')
  element.setAttribute('screen-xxxl', 'settext:[xxxl]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'xxxl')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
