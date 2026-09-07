test('canvas-grad - draws configured layers through canvas-grad', function () {
  var canvas = document.createElement('canvas')
  canvas.id = 'attribute-canvas-grad'
  var parent = document.createElement('div')
  parent.appendChild(canvas)
  document.body.appendChild(parent)
  try {
    Object.defineProperty(parent, 'offsetWidth', { value: 200 })
    Object.defineProperty(parent, 'offsetHeight', { value: 100 })
  } catch (e) { }
  var calls = []
  var gradient = { addColorStop: function (position, color) { calls.push('stop:' + position + ':' + color) } }
  canvas.getContext = function () {
    return {
      clearRect: function () { calls.push('clear') },
      createLinearGradient: function () { calls.push('gradient'); return gradient },
      fillRect: function () { calls.push('rect') }
    }
  }
  var controls = createElement('div')
  controls.setAttribute('canvas-target', '#attribute-canvas-grad')
  controls.setAttribute('width', '50%')
  controls.setAttribute('height', '50%')
  controls.setAttribute('canvas-grad', '')
  controls.setAttribute('canvas-grad-stops', 'red[0],blue[1]')
  controls.setAttribute('canvas-rec', '1,2,3,4,red')

  withProperty(window, 'setTimeout', function (callback) { callback(); return 1 }, function () {
    app.call('rerun', { element: controls })
  })

  assertEqual(canvas.width, 100)
  assertEqual(canvas.height, 50)
  assertTrue(calls.indexOf('gradient') !== -1)
  assertTrue(calls.indexOf('stop:0:red') !== -1)
  assertTrue(calls.indexOf('rect') !== -1)
  parent.remove()
})
