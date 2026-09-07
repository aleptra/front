test('moveafterbegin - should move element to first child', function () {
  var source = document.createElement('span')
  var target = document.createElement('div')
  var existing = document.createElement('span')
  source.id = 'moveafterbegin-source'
  target.id = 'moveafterbegin-target'
  existing.id = 'moveafterbegin-existing'
  target.appendChild(existing)
  document.body.appendChild(target)
  document.body.appendChild(source)

  app.call('moveafterbegin:#' + source.id + ':#' + target.id)
  assertEqual(target.firstChild.id, source.id)
})
