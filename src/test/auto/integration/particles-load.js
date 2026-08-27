test('particles-load - creates particles through particles--load', function () {
  var plugin = app.plugin.particles
  var oldConfig = plugin.config
  plugin.config = { particles: 3, maxSpeed: 1, size: 2, colors: ['#fff'], mousemove: false }
  var container = createElement('div')
  container.setAttribute('particles--load', '')
  withProperty(window, 'requestAnimationFrame', function () { return 1 }, function () {
    app.call('rerun', { element: container })
  })
  assertEqual(container.children.length, 3)
  plugin.config = oldConfig
})
