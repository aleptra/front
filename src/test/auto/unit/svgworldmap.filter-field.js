var svgworldmap = app.plugin.svgworldmap
svgworldmap.__autoload({ name: 'svgworldmap', element: document.body })

function touchPoint(x, y) {
  return { clientX: x, clientY: y }
}

function createSvgWorldMapFilterFixture(field, forceFallback, dragSensitivity) {
  var target = createElement('div')
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
  svgworldmap.initMap(target, svg, 0, 0, 1, true, '', '', '', {
    markers: [
      { lat: 0, lng: 0, label: 'City marker', symbol: 'circle', symbolSize: 14, tags: 'place', settlementType: 'city' },
      { lat: 1, lng: 1, label: 'Place marker', symbol: 'circle', symbolSize: '', tags: 'city', settlementType: 'place' }
    ]
  })

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

test('svgworldmap - should update label offsets when the render scale changes', function () {
  var target = createSvgWorldMapFilterFixture('settlementType')
  var svg = target.querySelector('svg')
  var state = target._svgWorldMap

  svg.getBoundingClientRect = function () { return { width: 200, height: 200 } }
  window.dispatchEvent(new Event('resize'))

  assertEqual(state.markerItems[0].elements.marker.getAttribute('r'), '7')
  assertEqual(parseFloat(state.markerItems[0].elements.text.getAttribute('y')) - parseFloat(state.markerItems[0].elements.marker.getAttribute('cy')), 12)

  target._svgWorldMapCleanup()
})

test('svgworldmap - should zoom in with a two-finger pinch', function () {
  var target = createSvgWorldMapFilterFixture('settlementType')
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var prevented = 0
  var event = { preventDefault: function () { prevented++ } }

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: event.preventDefault })
  svg.ontouchmove({ touches: [touchPoint(10, 50), touchPoint(50, 50)], preventDefault: event.preventDefault })

  assertTrue(mapGroup.getAttribute('transform').indexOf('scale(2)') !== -1)
  assertEqual(prevented, 2)

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
  var target = createSvgWorldMapFilterFixture('settlementType')
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var before

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  before = mapGroup.getAttribute('transform')
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(30, 50), touchPoint(50, 50)], preventDefault: function () { } })

  assertTrue(mapGroup.getAttribute('transform').indexOf('scale(1)') !== -1)
  assertTrue(mapGroup.getAttribute('transform') !== before)
  target._svgWorldMapCleanup()
})

test('svgworldmap - should zoom out with a two-finger pinch', function () {
  var target = createSvgWorldMapFilterFixture('settlementType')
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  svg.ontouchstart({ touches: [touchPoint(10, 50), touchPoint(50, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })

  assertTrue(mapGroup.getAttribute('transform').indexOf('scale(0.5)') !== -1)
  target._svgWorldMapCleanup()
})

test('svgworldmap - should configure drag sensitivity', function () {
  var target = createSvgWorldMapFilterFixture('settlementType', false, 2)
  var svg = target.querySelector('svg')
  var mapGroup = target.querySelector('.world-map')
  var before
  var after

  svg.getBoundingClientRect = function () { return { left: 0, top: 0, width: 100, height: 100 } }
  before = parseFloat(mapGroup.getAttribute('transform').match(/^translate\(([^,]+)/)[1])
  svg.ontouchstart({ touches: [touchPoint(20, 50), touchPoint(40, 50)], preventDefault: function () { } })
  svg.ontouchmove({ touches: [touchPoint(30, 50), touchPoint(50, 50)], preventDefault: function () { } })
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
