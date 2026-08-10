test('math - compute throughput', function () {
  var element = document.createElement('div')
  document.body.appendChild(element)
  var elapsed = measure(function () {
    for (var i = 0; i < 500; i++) {
      element.textContent = i + '+2*3'
      app.module.math.compute(element)
    }
  })

  assertEqual(element.textContent, '505')
  assertTrue(elapsed < 1000).desc('500 expressions computed in ' + elapsed.toFixed(2) + 'ms')
  element.parentNode.removeChild(element)
})
