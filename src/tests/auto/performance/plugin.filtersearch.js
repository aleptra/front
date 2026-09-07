test('filtersearch - large targeted search throughput', function () {
  var plugin = app.plugin.filtersearch
  plugin.__autoload({ name: 'filtersearch' })

  var input = document.createElement('input')
  input.type = 'text'
  input.setAttribute('filtersearch--input', '')
  input.value = 'Item 199'
  document.body.appendChild(input)

  var container = document.createElement('section')
  var markup = []
  for (var i = 0; i < 500; i++) {
    markup.push('<article filtersearch--select>Item ' + i + '</article>')
  }
  container.innerHTML = markup.join('')
  document.body.appendChild(container)

  var elapsed = measure(function () {
    for (var j = 0; j < 25; j++) {
      plugin.run({
        exec: { element: container },
        options: { element: input }
      })
    }
  })

  var rows = container.querySelectorAll('[filtersearch--select]')
  var visible = 0
  for (var k = 0; k < rows.length; k++) {
    if (rows[k].style.display !== 'none') visible++
  }

  assertEqual(plugin.totalMatches, 1)
  assertEqual(visible, 1)
  assertTrue(elapsed < 1500).desc('25 searches across 500 rows in ' + elapsed.toFixed(2) + 'ms')

  input.parentNode.removeChild(input)
  container.parentNode.removeChild(container)
})
