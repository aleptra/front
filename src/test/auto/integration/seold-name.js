test('seold-name - records a name through seold--name', function () {
  var plugin = app.plugin.seold
  plugin.__autoload({ name: 'seold', element: document.body })
  var oldTry = plugin._tryInject
  var called = false
  plugin._tryInject = function () { called = true }
  var element = createElement('span')
  element.textContent = 'Term'
  element.setAttribute('seold--name', '')
  element.originalText = 'Term'
  try { app.call('rerun', { element: element }); assertEqual(plugin.nameValue, 'Term'); assertTrue(called) } finally { plugin._tryInject = oldTry }
})
