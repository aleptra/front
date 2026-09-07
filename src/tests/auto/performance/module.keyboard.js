test('keyboard - registration and pruning throughput', function () {
  var keyboard = app.module.keyboard
  keyboard.keys = []
  keyboard.words = []
  var elements = []

  var elapsed = measure(function () {
    for (var i = 0; i < 200; i++) {
      var element = document.createElement('button')
      element.setAttribute('keyboard-key', 'a')
      element.setAttribute('keyboard-word', 'word' + i)
      document.body.appendChild(element)
      elements.push(element)
      keyboard.key(element)
      keyboard.word(element)
    }

    for (var j = 0; j < 100; j++) {
      elements[j].parentNode.removeChild(elements[j])
    }
    keyboard._prune()
  })

  assertEqual(keyboard.keys.length, 100)
  assertEqual(keyboard.words.length, 100)
  assertTrue(elapsed < 1000).desc('200 registrations and pruning in ' + elapsed.toFixed(2) + 'ms')

  for (var k = 100; k < elements.length; k++) {
    elements[k].parentNode.removeChild(elements[k])
  }
})
