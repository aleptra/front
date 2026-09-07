test('core.parse - parse and resolve throughput', function () {
  var target = createElement('div')
  var parsed

  var elapsed = measure(function () {
    for (var i = 0; i < 5000; i++) {
      parsed = app.parse.callString('settext:#' + target.id + ':[value]')
    }
  })

  assertTrue(parsed.func === 'settext').desc('Parser resolves the action')
  assertTrue(parsed.element === target).desc('Resolver finds the target element')
  assertTrue(elapsed < 1000).desc('5000 calls parsed in ' + elapsed.toFixed(2) + 'ms')
})

test('core.parse - selector and property path throughput', function () {
  var root = createElement('section')
  var markup = []
  var data = { items: [] }

  for (var i = 0; i < 250; i++) {
    markup.push('<span class="framework-performance-node">' + i + '</span>')
    data.items.push({ value: i })
  }
  root.innerHTML = markup.join('')

  var nodes
  var value
  var elapsed = measure(function () {
    for (var j = 0; j < 500; j++) {
      nodes = app.element.find(root, '*[class~="framework-performance-node"]')
      value = app.element.getPropertyByPath(data, 'items.249.value')
    }
  })

  assertEqual(nodes.length, 250)
  assertEqual(value, 249)
  assertTrue(elapsed < 1000).desc('500 selector/path passes in ' + elapsed.toFixed(2) + 'ms')
})
