test('moveafterend - should move element after target', function () {
  var source = document.createElement('span')
  var target = document.createElement('span')
  source.id = 'moveafterend-source'
  target.id = 'moveafterend-target'
  document.body.appendChild(source)
  document.body.appendChild(target)

  app.call('moveafterend:#' + source.id + ':#' + target.id)
  assertEqual(source.previousSibling.id, target.id)
})
