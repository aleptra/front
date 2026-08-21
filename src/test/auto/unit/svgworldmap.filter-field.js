var svgworldmap = app.plugin.svgworldmap
svgworldmap.__autoload({ name: 'svgworldmap', element: document.body })

function createSvgWorldMapFilterFixture(field, forceFallback) {
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
