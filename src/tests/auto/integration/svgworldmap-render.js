test('svgworldmap-render - builds a map shell through svgworldmap--render', function () {
  var plugin = app.plugin.svgworldmap
  plugin.__autoload({ name: 'svgworldmap', element: document.body })
  var oldLoad = plugin.load
  var target = createElement('div')
  target.setAttribute('svgworldmap--lat', '0')
  target.setAttribute('svgworldmap--lng', '0')
  target.setAttribute('svgworldmap--label', 'Center')
  target.setAttribute('svgworldmap--render', '')
  plugin.load = function (url, callback) {
    callback((url || '').indexOf('world.svg') !== -1 ? '<svg viewBox="0 0 100 100"><path class="land"></path></svg>' : null)
  }
  try {
    app.call('rerun', { element: target })
    assertTrue(!!target.querySelector('.svg-world-map'))
    assertTrue(!!target.querySelector('svg'))
  } finally {
    plugin.load = oldLoad
    if (target._svgWorldMapCleanup) target._svgWorldMapCleanup()
  }
})
