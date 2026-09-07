test('moveafter - should move element after target', function () {
  var source = document.createElement('span')
  var target = document.createElement('span')
  source.id = 'moveafter-source'
  target.id = 'moveafter-target'
  document.body.appendChild(source)
  document.body.appendChild(target)

  app.call('moveafter:#' + source.id + ':#' + target.id)
  assertEqual(source.previousSibling.id, target.id)
})
