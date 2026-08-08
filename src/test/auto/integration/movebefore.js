test('movebefore - should move element before target', function () {
  var source = document.createElement('span')
  var target = document.createElement('span')
  source.id = 'movebefore-source'
  target.id = 'movebefore-target'
  document.body.appendChild(target)
  document.body.appendChild(source)

  app.call('movebefore:#' + source.id + ':#' + target.id)
  assertEqual(source.nextSibling.id, target.id)
})
