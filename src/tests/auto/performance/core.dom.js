test('core.dom - app.call DOM action throughput', function () {
  var target = createElement('div')
  var elapsed = measure(function () {
    for (var i = 0; i < 250; i++) {
      app.call('settext:#' + target.id + ':[value]')
    }
  })

  assertEqual(target.innerText, 'value')
  assertTrue(elapsed < 1000).desc('250 DOM actions in ' + elapsed.toFixed(2) + 'ms')
})

test('core.dom - clone throughput', function () {
  var source = createElement('div')
  var markup = []

  for (var i = 0; i < 50; i++) {
    markup.push('<article><span>' + i + '</span></article>')
  }
  source.innerHTML = markup.join('')

  var target = createElement('div')
  var elapsed = measure(function () {
    for (var j = 0; j < 100; j++) {
      app.call('clone:#' + target.id + ':#' + source.id)
    }
  })

  assertEqual(target.querySelectorAll('article').length, 50)
  assertEqual(source.querySelectorAll('article').length, 50)
  assertTrue(elapsed < 1000).desc('100 clones of 50 nodes in ' + elapsed.toFixed(2) + 'ms')
})
