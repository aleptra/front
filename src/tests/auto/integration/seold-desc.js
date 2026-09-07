test('seold-desc - records a description through seold--desc', function () {
  var plugin = app.plugin.seold
  plugin.__autoload({ name: 'seold', element: document.body })
  var oldTry = plugin._tryInject
  plugin._tryInject = function () { }
  var element = createElement('span')
  element.textContent = 'Definition'
  element.setAttribute('seold--desc', '')
  element.originalText = 'Definition'
  try { app.call('rerun', { element: element }); assertEqual(plugin.descValue, 'Definition') } finally { plugin._tryInject = oldTry }
})
