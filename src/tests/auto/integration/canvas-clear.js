test('canvas-clear - clears a target through canvas-clear', function () {
  var canvas = document.createElement('canvas')
  canvas.id = 'attribute-canvas-clear'
  document.body.appendChild(canvas)
  var cleared = 0
  canvas.getContext = function () { return { clearRect: function () { cleared++ } } }
  var controls = createElement('div')
  controls.setAttribute('canvas-target', '#attribute-canvas-clear')
  controls.setAttribute('canvas-clear', '')

  app.call('rerun', { element: controls })

  assertTrue(cleared > 0)
  canvas.remove()
})
