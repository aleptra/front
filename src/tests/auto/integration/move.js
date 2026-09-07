test('move - should move element to target', function () {
  var source = document.createElement('div')
  var target = document.createElement('div')
  source.id = 'move-source'
  target.id = 'move-target'
  document.body.appendChild(source)
  document.body.appendChild(target)

  app.call('move:#' + source.id + ':#' + target.id)
  assertEqual(source.parentNode.id, target.id)
})
