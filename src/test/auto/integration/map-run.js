test('map-run - queues a target through map--run', function () {
  var plugin = app.plugin.map
  var oldPlugin = plugin.plugin
  var oldTarget = plugin._pendingTarget
  plugin.plugin = 'map-'
  var target = createElement('div')
  target.setAttribute('map--lat', '10')
  target.setAttribute('map--lng', '20')
  target.setAttribute('map--run', '')
  try {
    app.call('map--run', { srcElement: target })
    assertEqual(plugin._pendingTarget, target)
  } finally {
    plugin.plugin = oldPlugin
    plugin._pendingTarget = oldTarget
  }
})
