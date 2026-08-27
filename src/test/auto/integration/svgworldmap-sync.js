test('svgworldmap-sync - rerenders a target through svgworldmap--sync', function () {
  var plugin = app.plugin.svgworldmap
  var target = createElement('div')
  var called = false
  withStub(plugin, 'render', function (element) { called = element }, function () {
    var button = createElement('button')
    button.setAttribute('clicktargetfield', '#' + target.id)
    button.setAttribute('click', 'svgworldmap--sync')
    app.call('svgworldmap--sync', { element: target })
  })
  assertEqual(called, target)
})
