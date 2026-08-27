test('seold-url - records a URL through seold--url', function () {
  var plugin = app.plugin.seold
  plugin.__autoload({ name: 'seold', element: document.body })
  var oldTry = plugin._tryInject
  plugin._tryInject = function () { }
  var element = createElement('a')
  element.href = '/term'
  element.setAttribute('seold--url', '')
  try { app.call('rerun', { element: element }); assertContains(plugin.urlValue, '/term') } finally { plugin._tryInject = oldTry }
})
