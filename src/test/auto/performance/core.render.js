test('core.render - rerun rendering throughput', function () {
  var root = document.createElement('section')
  document.body.appendChild(root)
  var markup = []

  for (var i = 0; i < 100; i++) {
    markup.push('<p settext="ready"></p>')
  }
  root.innerHTML = markup.join('')

  var elapsed = measure(function () {
    dom.rerun(root)
  })

  var nodes = root.querySelectorAll('p')
  var ready = 0
  for (var j = 0; j < nodes.length; j++) {
    if (nodes[j].textContent === 'ready') ready++
  }

  assertEqual(ready, 100)
  assertTrue(elapsed < 1000).desc('100 nodes rendered in ' + elapsed.toFixed(2) + 'ms')

  root.parentNode.removeChild(root)
})

test('core.render - large DOM rerender workload', function () {
  var root = document.createElement('section')
  document.body.appendChild(root)
  var markup = []

  for (var i = 0; i < 500; i++) {
    markup.push('<p class="large-render-node" settext="ready"></p>')
  }
  root.innerHTML = markup.join('')

  var elapsed = measure(function () {
    dom.rerun(root)
  })

  var nodes = root.querySelectorAll('.large-render-node')
  var rendered = 0
  for (var j = 0; j < nodes.length; j++) {
    if (nodes[j].textContent === 'ready') rendered++
  }

  assertEqual(rendered, 500)
  assertTrue(elapsed < 1500).desc('500 nodes rendered in ' + elapsed.toFixed(2) + 'ms')

  root.parentNode.removeChild(root)
})
