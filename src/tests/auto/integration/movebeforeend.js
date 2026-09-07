test('movebeforeend - should move element to last child', function () {
  var source = document.createElement('span')
  var target = document.createElement('div')
  var existing = document.createElement('span')
  source.id = 'movebeforeend-source'
  target.id = 'movebeforeend-target'
  existing.id = 'movebeforeend-existing'
  target.appendChild(existing)
  document.body.appendChild(target)
  document.body.appendChild(source)

  app.call('movebeforeend:#' + source.id + ':#' + target.id)
  assertEqual(target.lastChild.id, source.id)
})
