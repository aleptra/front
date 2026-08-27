test('wave-load - handles an empty image source through wave--load', function () {
  var container = createElement('div')
  container.setAttribute('wave--load', '')
  app.call('rerun', { element: container })
  assertEqual(container.querySelectorAll('canvas').length, 0)
})
