test('screen-sm - applies the sm breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'sm'
  var element = createElement('div')
  element.setAttribute('screen-sm', 'settext:[sm]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'sm')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
