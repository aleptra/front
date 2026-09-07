test('screen-ultra - applies the ultra breakpoint attribute', function () {
  var screen = app.module.screen
  var oldModule = screen.module
  var oldCurrentBp = screen.currentBp
  screen.module = 'screen'
  screen.currentBp = 'ultra'
  var element = createElement('div')
  element.setAttribute('screen-ultra', 'settext:[ultra]')

  try {
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'ultra')
  } finally {
    screen.module = oldModule
    screen.currentBp = oldCurrentBp
  }
})
