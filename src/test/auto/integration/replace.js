test('replace - should delegate to insertion', function () {
  var target = createElement('div')
  target.textContent = 'old'
  target.lastRunAttribute = 'insertafterbegin'

  dom.replace(target, 'new ')

  assertEqual(target.textContent, 'new old')
})
