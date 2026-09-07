test('movebeforebegin - should move element before target', function () {
  var source = document.createElement('span')
  var target = document.createElement('span')
  source.id = 'movebeforebegin-source'
  target.id = 'movebeforebegin-target'
  document.body.appendChild(target)
  document.body.appendChild(source)

  app.call('movebeforebegin:#' + source.id + ':#' + target.id)
  assertEqual(source.nextSibling.id, target.id)
})
