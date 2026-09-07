test('screen-md - applies the md breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'md'
  var element = createElement('div')
  element.setAttribute('screen-md', 'settext:[md]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'md')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
