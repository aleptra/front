test('clipboard-paste - reads into a target through clipboard--paste', function () {
  var clipboard = app.plugin.clipboard
  var oldConfig = clipboard.config
  clipboard.config = { range: 'false' }
  var target = createElement('input')
  withProperty(navigator, 'clipboard', { readText: function () { return Promise.resolve('pasted') } }, function () {
    target.setAttribute('clipboard--paste', '')
    app.call('rerun', { element: target })
  })
  assertTrue(!!target[clipboard._marker])
  clipboard.config = oldConfig
})
