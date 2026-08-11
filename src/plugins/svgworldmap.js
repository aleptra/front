
'use strict'

app.plugin.svgworldmap = {

  __autoload: function (options) {
    this.plugin = options.name + '--'

    this.config = app.config.get(
      this.plugin,
      {
        defaultZoom: '1',
        fixedMarkerSize: true
      },
      options.element
    )
  },

  render: function (options) {
    var target = options

    var lat = parseFloat(target.getAttribute(this.plugin + 'lat')),
      lng = parseFloat(target.getAttribute(this.plugin + 'lng')),
      zoom = parseFloat(target.getAttribute(this.plugin + 'zoom') || this.config.defaultZoom),
      fixedMarkerSize = target.hasAttribute('fixed-marker')
        ? target.getAttribute('fixed-marker') === 'true'
        : this.config.fixedMarkerSize


    var oceancolor = target.getAttribute(this.plugin + 'oceancolor') || 'transparent',
      landColor = target.getAttribute(this.plugin + 'landcolor') || 'transparent',
      borderColor = target.getAttribute(this.plugin + 'bordercolor') || 'transparent',
      title = target.getAttribute(this.plugin + 'title'),
      labelText = target.getAttribute(this.plugin + 'label'),
      btnBg = target.getAttribute(this.plugin + 'btnbg') || '#f8f9fa',
      btnColor = target.getAttribute(this.plugin + 'btncolor') || 'inherit',
      btnBorder = target.getAttribute(this.plugin + 'btnborder') || '1px solid #ccc'

    var container = document.createElement('div')

    container.innerHTML =
      '<figure class="svg-world-map" style="position:relative;display:block">' +

      '<div class="svg-world-map-controls" style="' +
      'position:absolute;' +
      'top:12px;' +
      'right:12px;' +
      'z-index:10;' +
      'display:flex;' +
      'gap:4px;' +
      'padding:4px;' +
      'border-radius:6px;' +
      'box-shadow:0 2px 6px rgba(0,0,0,0.15);' +
      '">' +

      '<button type="button" class="svg-zoom-in" style="' +
      'padding: 6px 10px;' +
      'font-weight: bold;' +
      'cursor:pointer;' +
      'color:' + btnColor + ';' +
      'background:' + btnBg + ';' +
      'border:' + btnBorder + ';' +
      'border-radius: 4px;' +
      '">+</button>' +

      '<button type="button" class="svg-zoom-out" style="' +
      'padding:6px 10px;' +
      'font-weight:bold;' +
      'cursor:pointer;' +
      'color:' + btnColor + ';' +
      'background:' + btnBg + ';' +
      'border:' + btnBorder + ';' +
      'border-radius:4px;' +
      '">−</button>' +

      '<button type="button" class="svg-zoom-reset" style="' +
      'padding:6px 10px;' +
      'font-size:11px;' +
      'cursor:pointer;' +
      'color:' + btnColor + ';' +
      'background:' + btnBg + ';' +
      'border:' + btnBorder + ';' +
      'border-radius:4px;' +
      '">Reset</button>' +

      '</div>' +

      '<div class="svg-world-map-viewport" style="' +
      'overflow:hidden;' +
      'border-radius:8px;' +
      'border:1px solid #b0d4e3;' +
      'background:' + oceancolor + ';' +
      '">' +

      '<div class="svg-world-map-loading" style="' +
      'padding:40px;' +
      'text-align:center;' +
      'font-family:sans-serif;' +
      'color:#555;' +
      '">' +
      'Loading map…' +
      '</div>' +

      '</div>' +

      '</figure>'

    while (target.firstChild) {
      target.removeChild(target.firstChild)
    }

    while (container.firstChild) {
      target.appendChild(container.firstChild)
    }

    this.loadMap(target, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor)
  },

  loadMap: function (target, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor) {
    var viewport = target.querySelector('.svg-world-map-viewport')
    var xhr = new XMLHttpRequest()

    xhr.open('GET', '/assets/maps/worldorg.svg', true)

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return
      }

      if (xhr.status >= 200 && xhr.status < 300) {

        viewport.innerHTML = xhr.responseText

        var svg = viewport.querySelector('svg')

        if (!svg) {
          return
        }

        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

        svg.style.display = 'block'
        svg.style.width = '100%'
        svg.style.height = 'auto'
        svg.style.cursor = 'grab'
        svg.style.userSelect = 'none'

        this.initMap(target, svg, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor)
      }
    }.bind(this)

    xhr.send(null)
  },

  initMap: function (target, svg, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor) {

    var landElements = svg.querySelectorAll('.land')
    var landIndex

    if (landColor) {
      for (landIndex = 0; landIndex < landElements.length; landIndex++) {
        landElements[landIndex].style.fill = landColor
      }
    }

    var viewBox = svg.getAttribute('viewBox')

    var parts = viewBox ? viewBox.split(/[\s,]+/) : []

    var viewX = 0
    var viewY = 0
    var width = 2752.766
    var height = 1537.631

    if (parts.length >= 4) {
      viewX = parseFloat(parts[0])
      viewY = parseFloat(parts[1])
      width = parseFloat(parts[2])
      height = parseFloat(parts[3])
    }

    /*
     * ==========================================================
     * WORLD6 EQUIRECTANGULAR COORDINATE SYSTEM
     * ==========================================================
     *
     * This particular Wikimedia SVG is NOT centered at:
     *
     *     width / 2
     *
     * for longitude 0.
     *
     * The actual map data is shifted horizontally.
     *
     * These values are calibrated against the uploaded
     * BlankMap-World6-Equirectangular.svg.
     *
     * Longitude:
     *
     *     x = longitude * X_SCALE + X_OFFSET
     *
     * Latitude:
     *
     *     y = latitude * Y_SCALE + Y_OFFSET
     *
     * Latitude increases northward, therefore Y_SCALE
     * is negative.
     */

    var X_SCALE = width / 360,
      Y_SCALE = -(height / 180)

    /*
     * Greenwich / equator position in this SVG.
     */
    var X_OFFSET = 1270.5,
      Y_OFFSET = 787.0

    /*
     * Convert geographic coordinates to SVG coordinates.
     */
    var markerX = (lng * X_SCALE) + X_OFFSET,
      markerY = (lat * Y_SCALE) + Y_OFFSET

    /*
     * Validate coordinates.
     */
    if (isNaN(markerX) || isNaN(markerY)) {
      markerX = width / 2
      markerY = height / 2
    }

    /*
     * Create a group containing the original map.
     *
     * This is much safer than transforming every path
     * individually.
     */
    var mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    mapGroup.setAttribute('class', 'world-map')

    /*
     * Move original SVG content into mapGroup.
     */
    var children = []
    var i

    for (i = 0; i < svg.childNodes.length; i++) {
      children.push(
        svg.childNodes[i]
      )
    }

    for (i = 0; i < children.length; i++) {
      var child = children[i]

      /*
       * Keep defs outside the map group.
       */
      if (child.nodeType === 1 && child.nodeName.toLowerCase() === 'defs') {
        continue
      }

      /*
       * Don't move the marker layer.
       */
      if (child.nodeType === 1 && child.getAttribute && child.getAttribute('class') === 'world-marker-layer') {
        continue
      }

      mapGroup.appendChild(child)
    }

    svg.appendChild(mapGroup)

    /*
     * Marker layer.
     */
    var markerLayer = svg.querySelector('.world-marker-layer')

    if (!markerLayer) {
      markerLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      markerLayer.setAttribute('class', 'world-marker-layer')
      svg.appendChild(markerLayer)
    }

    /*
     * Add marker.
     */
    var elements = this.addMarkerWithLabel(markerLayer, labelText),
      marker = elements.marker,
      textEl = elements.text

    /*
     * Map state.
     */
    var state = {
      scale: isNaN(zoom) ? 1 : zoom,
      x: 0,
      y: 0,
      dragging: false,
      startX: 0,
      startY: 0
    }

    /*
     * Put selected location in the center.
     */
    function centerOnMarker() {
      state.x = (width / 2) - (markerX * state.scale)
      state.y = (height / 2) - (markerY * state.scale)
    }

    centerOnMarker()

    /*
     * Update map.
     */
    function update() {

      var scale = isNaN(state.scale) ? 1 : state.scale

      var x = isNaN(state.x) ? 0 : state.x,
        y = isNaN(state.y) ? 0 : state.y

      /*
       * Transform map.
       */
      mapGroup.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + scale + ')')

      /*
       * Marker position.
       *
       * The marker itself is NOT inside mapGroup,
       * therefore we calculate its transformed position.
       */
      var currentX = (markerX * scale) + x,
        currentY = (markerY * scale) + y

      marker.setAttribute('cx', currentX)
      marker.setAttribute('cy', currentY)
      textEl.setAttribute('x', currentX)
      textEl.setAttribute('y', currentY + 50)

      /*
       * Keep marker the same visual size.
       */
      if (fixedMarkerSize) {

        var rect = svg.getBoundingClientRect()
        var renderScale = rect.width / width

        if (renderScale > 0 && !isNaN(renderScale)) {
          marker.setAttribute('r', 8 / renderScale)
          marker.setAttribute('stroke-width', 2.5 / renderScale)
          textEl.setAttribute('font-size', (11 / renderScale) + 'px')
        }
      }
    }

    /*
     * Zoom controls.
     */
    var zoomIn = target.querySelector('.svg-zoom-in'),
      zoomOut = target.querySelector('.svg-zoom-out'),
      reset = target.querySelector('.svg-zoom-reset')

    /*
     * Zoom around a point.
     */
    function zoomAround(newScale, pointX, pointY) {
      var oldScale = state.scale

      if (newScale === oldScale) {
        return
      }

      state.x = pointX - (pointX - state.x) * (newScale / oldScale)
      state.y = pointY - (pointY - state.y) * (newScale / oldScale)
      state.scale = newScale

      update()
    }

    /*
     * Zoom in.
     */
    zoomIn.onclick = function () {
      zoomAround(Math.min(state.scale * 1.5, 100), width / 2, height / 2)
    }

    /*
     * Zoom out.
     */
    zoomOut.onclick = function () {
      zoomAround(Math.max(state.scale / 1.5, 0.5), width / 2, height / 2)
    }

    /*
     * Reset.
     */
    reset.onclick = function () {

      state.scale = isNaN(zoom) ? 1 : zoom

      centerOnMarker()

      update()
    }

    /*
     * Mouse drag.
     */
    svg.onmousedown =
      function (event) {

        event.preventDefault()

        state.dragging = true
        state.startX = event.clientX - state.x
        state.startY = event.clientY - state.y

        svg.style.cursor = 'grabbing'
      }

    /*
     * Use window rather than document
     * so dragging continues outside SVG.
     */
    var rafPending = false

    window.onmousemove =
      function (event) {

        if (!state.dragging) {
          return
        }

        state.x = event.clientX - state.startX
        state.y = event.clientY - state.startY

        if (!rafPending) {
          rafPending = true
          requestAnimationFrame(function () {
            rafPending = false
            update()
          })
        }
      }

    window.onmouseup =
      function () {
        state.dragging = false
        svg.style.cursor = 'grab'
      }

    /*
     * Wheel zoom.
     */
    svg.onwheel =
      function (event) {

        event.preventDefault()

        var rect = svg.getBoundingClientRect()
        var mouseX = ((event.clientX - rect.left) / rect.width) * width
        var mouseY = ((event.clientY - rect.top) / rect.height) * height
        var newScale

        if (event.deltaY < 0) {
          newScale = Math.min(state.scale * 1.15, 100)
        } else {
          newScale = Math.max(state.scale / 1.15, 0.5)
        }

        zoomAround(newScale, mouseX, mouseY)
      }

    /*
     * Initial rendering.
     */
    update()
  },

  addMarkerWithLabel: function (markerLayer, labelText) {
    var ns = 'http://www.w3.org/2000/svg'

    var marker = document.createElementNS(ns, 'circle')
    marker.setAttribute('r', '8')
    marker.setAttribute('fill', '#e74c3c')
    marker.setAttribute('stroke', '#ffffff')
    marker.setAttribute('stroke-width', '2.5')
    marker.setAttribute('class', 'svg-world-map-marker')

    markerLayer.appendChild(marker)

    var text = document.createElementNS(ns, 'text')
    text.textContent = labelText
    text.setAttribute('font-size', '11px')
    text.setAttribute('fill', '#1a365d')
    text.setAttribute('font-weight', 'bold')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-family', 'sans-serif')
    text.setAttribute('pointer-events', 'none')

    markerLayer.appendChild(text)

    return {
      marker: marker,
      text: text
    }
  }
}
