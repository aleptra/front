test('screen-xs - applies the xs breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'xs'
  var element = createElement('div')
  element.setAttribute('screen-xs', 'settext:[xs]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'xs')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
