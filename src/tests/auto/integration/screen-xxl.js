test('screen-xxl - applies the xxl breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'xxl'
  var element = createElement('div')
  element.setAttribute('screen-xxl', 'settext:[xxl]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'xxl')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
