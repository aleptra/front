test('clipboard-copy - writes selected text through clipboard--copy', function () {
  var clipboard = app.plugin.clipboard
  var oldConfig = clipboard.config
  clipboard.config = { range: 'false' }
  var copied = ''
  withProperty(navigator, 'clipboard', { writeText: function (value) { copied = value; return Promise.resolve() } }, function () {
    var source = createElement('div')
    source.textContent = 'copy me'
    source.setAttribute('clipboard--copy', '')
    app.call('rerun', { element: source })
    assertEqual(copied, 'copy me')
  })
  clipboard.config = oldConfig
})
