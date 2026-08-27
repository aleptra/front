test('confetti-load - creates configured pieces through confetti--load', function () {
  var plugin = app.plugin.confetti
  var oldConfig = plugin.config
  plugin.config = { count: 30, src: '', colors: '#f00', size: 10, speed: 1.5, direction: 'down', wobble: false, rotate: false, fade: false, fadein: true, fadeout: true }
  var container = createElement('div')
  container.setAttribute('confetti--load', '')
  container.setAttribute('confetti-count', '3')
  withProperty(window, 'requestAnimationFrame', function () { return 1 }, function () {
    app.call('rerun', { element: container })
  })
  assertEqual(container.children.length, 3)
  plugin.config = oldConfig
})
