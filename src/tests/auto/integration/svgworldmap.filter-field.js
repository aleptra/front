var svgworldmap = app.plugin.svgworldmap
svgworldmap.__autoload({ name: 'svgworldmap', element: document.body })

function touchPoint(x, y) {
  return { clientX: x, clientY: y }
}

function createSvgWorldMapFilterFixture(field, forceFallback, dragSensitivity, deferFrames, markers) {
  var target = createElement('div')
  var frameCallback
  var frameRequests = 0
  var originalRequestAnimationFrame
  var originalCancelAnimationFrame
  var zoomClasses = ['svg-zoom-in', 'svg-zoom-out', 'svg-zoom-reset']
  var zoomControls = document.createElement('div')
  var mapFigure = document.createElement('figure')
  var mapViewport = document.createElement('div')
  var fullscreenButton = document.createElement('button')
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  var i

  mapFigure.className = 'svg-world-map'
  mapFigure.style.position = 'relative'
  mapFigure.style.display = 'block'
  mapViewport.className = 'svg-world-map-viewport'
  fullscreenButton.className = 'svg-fullscreen-toggle'

  for (i = 0; i < zoomClasses.length; i++) {
    var zoomButton = document.createElement('button')
    zoomButton.className = zoomClasses[i]
    zoomControls.appendChild(zoomButton)
  }

  mapFigure.appendChild(zoomControls)
  mapFigure.appendChild(mapViewport)
  mapFigure.appendChild(fullscreenButton)
  mapViewport.appendChild(svg)
  target.appendChild(mapFigure)
  svg.setAttribute('viewBox', '0 0 100 100')
  target.setAttribute('svgworldmap-filter', 'City:[city];Place:[place]')
  if (field) target.setAttribute('svgworldmap-filter-field', field)
  if (dragSensitivity) target.setAttribute('svgworldmap-drag-sensitivity', dragSensitivity)

  if (forceFallback) {
    mapFigure.requestFullscreen = null
    mapFigure.webkitRequestFullscreen = null
    mapFigure.mozRequestFullScreen = null
    mapFigure.msRequestFullscreen = null
  }
  if (deferFrames) {
    originalRequestAnimationFrame = window.requestAnimationFrame
    originalCancelAnimationFrame = window.cancelAnimationFrame
    window.requestAnimationFrame = function (callback) {
      frameRequests++
      frameCallback = callback
      return 1
    }
    window.cancelAnimationFrame = function () { frameCallback = null }
  }

  svgworldmap.initMap(target, svg, 0, 0, 1, true, '', '', '', {
    markers: markers || [
      { lat: 0, lng: 0, label: 'City marker', symbol: 'circle', symbolSize: 14, tags: 'place', settlementType: 'city' },
      { lat: 1, lng: 1, label: 'Place marker', symbol: 'circle', symbolSize: '', tags: 'city', settlementType: 'place' }
    ]
  })

  if (deferFrames) {
    var cleanup = target._svgWorldMapCleanup
    target._svgWorldMapFlush = function () {
      var callback = frameCallback
      frameCallback = null
      if (callback) callback()
    }
    target._svgWorldMapCaptureFrame = function () {
      var callback = frameCallback
      frameCallback = null
      return callback
    }
    target._svgWorldMapFrameRequests = function () { return frameRequests }
    target._svgWorldMapCleanup = function () {
      cleanup()
      window.requestAnimationFrame = originalRequestAnimationFrame
      window.cancelAnimationFrame = originalCancelAnimationFrame
    }
  }

  return target
}

test('svgworldmap - should use a selected JSON field for filters', function () {
  var target = createSvgWorldMapFilterFixture('settlementType')
  var state = target._svgWorldMap

  assertEqual(state.filterField, 'settlementType')
  assertEqual(state.markerItems[0].tags[0], 'city')
  assertEqual(state.markerItems[1].tags[0], 'place')
  assertEqual(state.markerItems[0].elements.marker.getAttribute('r'), '14')
  assertEqual(state.markerItems[1].elements.marker.getAttribute('r'), '8')
  assertEqual(parseFloat(state.markerItems[0].elements.text.getAttribute('y')) - parseFloat(state.markerItems[0].elements.marker.getAttribute('cy')), 24)
  assertEqual(parseFloat(state.markerItems[1].elements.text.getAttribute('y')) - parseFloat(state.markerItems[1].elements.marker.getAttribute('cy')), 18)

  svgworldmap.filter(target, ['city'])

  assertEqual(state.markerItems[0].elements.marker.style.display, '')
  assertEqual(state.markerItems[1].elements.marker.style.display, 'none')
})

test('svgworldmap - should position labels from marker JSON', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, undefined, false, [
    { lat: 0, lng: 0, label: 'Top', labelPosition: 'top', symbol: 'circle', symbolSize: 10 },
    { lat: 1, lng: 1, label: 'Right', labelPosition: 'right', symbol: 'circle', symbolSize: 10 },
    { lat: 2, lng: 2, label: 'Bottom', labelPosition: 'bottom', symbol: 'circle', symbolSize: 10 },
    { lat: 3, lng: 3, label: 'Left', labelPosition: 'left', symbol: 'circle', symbolSize: 10 },
    { lat: 4, lng: 4, label: 'Invalid', labelPosition: 'diagonal', symbol: 'circle', symbolSize: 10 }
  ])
  var items = target._svgWorldMap.markerItems
  var i, cx, cy, labelX, labelY

  for (i = 0; i < 4; i++) {
    cx = parseFloat(items[i].elements.marker.getAttribute('cx'))
    cy = parseFloat(items[i].elements.marker.getAttribute('cy'))
    labelX = parseFloat(items[i].elements.text.getAttribute('x'))
    labelY = parseFloat(items[i].elements.text.getAttribute('y'))
    assertEqual(items[i].labelPosition, ['top', 'right', 'bottom', 'left'][i])
    if (i === 0) {
      assertEqual(labelX, cx)
      assertEqual(cy - labelY, 20)
    } else if (i === 1) {
      assertEqual(labelX - cx, 20)
      assertEqual(labelY, cy)
      assertEqual(items[i].elements.text.getAttribute('text-anchor'), 'start')
      assertEqual(items[i].elements.text.getAttribute('dominant-baseline'), 'middle')
    } else if (i === 2) {
      assertEqual(labelX, cx)
      assertEqual(labelY - cy, 20)
    } else {
      assertEqual(cx - labelX, 20)
      assertEqual(labelY, cy)
      assertEqual(items[i].elements.text.getAttribute('text-anchor'), 'end')
      assertEqual(items[i].elements.text.getAttribute('dominant-baseline'), 'middle')
    }
  }

  assertEqual(items[4].labelPosition, 'bottom')
  target._svgWorldMapCleanup()
})


test('svgworldmap - should zoom in with a two-finger pinch', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, undefined, true)
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var prevented = 0
  var event = { preventDefault: function () { prevented++ } }

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: event.preventDefault })
  svg.ontouchmove({ touches: [touchPoint(15, 50), touchPoint(45, 50)], preventDefault: event.preventDefault })
  svg.ontouchmove({ touches: [touchPoint(10, 50), touchPoint(50, 50)], preventDefault: event.preventDefault })
  target._svgWorldMapFlush()

  assertEqual(target._svgWorldMapFrameRequests(), 1)
  assertTrue(mapGroup.getAttribute('transform').indexOf('scale(2)') !== -1)
  assertEqual(prevented, 3)

  var transform = mapGroup.getAttribute('transform')
  svg.ontouchend({ touches: [touchPoint(30, 50)] })
  svg.ontouchmove({ touches: [touchPoint(10, 50), touchPoint(50, 50)], preventDefault: event.preventDefault })
  assertEqual(mapGroup.getAttribute('transform'), transform)

  assertTrue(typeof svg.ontouchstart === 'function')
  target._svgWorldMapCleanup()
  assertEqual(svg.ontouchstart, null)
  assertEqual(svg.ontouchmove, null)
})

test('svgworldmap - should pan with two fingers', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, undefined, true)
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var before

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  before = mapGroup.getAttribute('transform')
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(30, 50), touchPoint(50, 50)], preventDefault: function () { } })
  target._svgWorldMapFlush()

  assertTrue(mapGroup.getAttribute('transform').indexOf('scale(1)') !== -1)
  assertTrue(mapGroup.getAttribute('transform') !== before)
  target._svgWorldMapCleanup()
})

test('svgworldmap - should ignore a queued touch update after cleanup', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, undefined, true)
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var before
  var staleFrame

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  before = mapGroup.getAttribute('transform')
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(30, 50), touchPoint(50, 50)], preventDefault: function () { } })
  staleFrame = target._svgWorldMapCaptureFrame()
  target._svgWorldMapCleanup()
  if (staleFrame) staleFrame()

  assertEqual(mapGroup.getAttribute('transform'), before)
})

test('svgworldmap - should zoom out with a two-finger pinch', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, undefined, true)
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  svg.ontouchstart({ touches: [touchPoint(10, 50), touchPoint(50, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })
  target._svgWorldMapFlush()

  assertTrue(mapGroup.getAttribute('transform').indexOf('scale(0.5)') !== -1)
  target._svgWorldMapCleanup()
})

test('svgworldmap - should configure drag sensitivity', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, 2, true)
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var before
  var after

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  before = parseFloat(mapGroup.getAttribute('transform').match(/^translate\(([^,]+)/)[1])
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(30, 50), touchPoint(50, 50)], preventDefault: function () { } })
  target._svgWorldMapFlush()

  after = parseFloat(mapGroup.getAttribute('transform').match(/^translate\(([^,]+)/)[1])
  assertEqual(after - before, 20)
  target._svgWorldMapCleanup()
})

test('svgworldmap - should provide an expand fallback without fullscreen support', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', true)
  var figure = target.querySelector('.svg-world-map')
  var button = target.querySelector('.svg-fullscreen-toggle')

  assertEqual(button.textContent, 'Expand map')
  button.click()

  assertEqual(button.textContent, 'Collapse map')
  assertEqual(button.getAttribute('aria-pressed'), 'true')
  assertEqual(figure.style.position, 'fixed')
  assertEqual(document.documentElement.style.overflow, 'hidden')

  button.click()

  assertEqual(button.textContent, 'Expand map')
  assertEqual(button.getAttribute('aria-pressed'), 'false')
  assertEqual(figure.style.position, 'relative')
  assertEqual(document.documentElement.style.overflow, '')

  target._svgWorldMapCleanup()
})

test('svgworldmap - should keep tags as the default filter field', function () {
  var target = createSvgWorldMapFilterFixture()
  var state = target._svgWorldMap

  assertEqual(state.filterField, 'tags')
  assertEqual(state.markerItems[0].tags[0], 'place')
  assertEqual(state.markerItems[1].tags[0], 'city')
})

test('svgworldmap - should fall back to the default circle size for invalid values', function () {
  var layer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  var marker = svgworldmap.addMarkerWithLabel(layer, { symbol: 'circle', symbolSize: 'invalid' }, []).marker

  assertEqual(marker.getAttribute('r'), '8')
})
