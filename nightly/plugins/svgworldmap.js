'use strict'

app.plugin.svgworldmap = {

  __autoload: function (options) {
    this.plugin = options.name + '--'
    this.config = app.config.get(options.name + '-', { defaultZoom: '1', fixedMarkerSize: true, hideFilterAll: false }, options.element)
  },

  render: function (target) {
    var renderToken = (target._svgWorldMapRenderToken || 0) + 1
    target._svgWorldMapRenderToken = renderToken

    if (target._svgWorldMapCleanup) {
      target._svgWorldMapCleanup()
      target._svgWorldMapCleanup = null
    }

    var self = this
    function getAttr(name, def) {
      return target.getAttribute(self.plugin + name) || def
    }

    var lat = parseFloat(getAttr('lat')),
      lng = parseFloat(getAttr('lng')),
      zoom = parseFloat(getAttr('zoom', this.config.defaultZoom)),
      markersUrl = getAttr('markers'),
      fixedMarkerSize = target.hasAttribute('fixed-marker')
        ? target.getAttribute('fixed-marker') === 'true'
        : this.config.fixedMarkerSize,
      oceanColor = getAttr('oceancolor', 'transparent'),
      landColor = getAttr('landcolor', 'transparent'),
      borderColor = getAttr('bordercolor', 'transparent'),
      labelText = getAttr('label'),
      btnBg = getAttr('btnbg', '#f8f9fa'),
      btnColor = getAttr('btncolor', 'inherit'),
      btnBorder = getAttr('btnborder', '1px solid #ccc')

    var btnStyle = 'padding:6px 10px;font-weight:bold;cursor:pointer;color:' + btnColor + ';background:' + btnBg + ';border:' + btnBorder + ';border-radius:4px;'

    target.innerHTML =
      '<figure class="svg-world-map" style="position:relative;display:block">' +
      '<div class="svg-world-map-controls" style="position:absolute;top:12px;right:12px;z-index:10;display:flex;gap:4px;padding:4px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.15);">' +
      '<button type="button" class="svg-zoom-in" style="' + btnStyle + '">+</button>' +
      '<button type="button" class="svg-zoom-out" style="' + btnStyle + '">−</button>' +
      '<button type="button" class="svg-zoom-reset" style="' + btnStyle + 'font-size:11px;">Reset</button>' +
      '</div>' +
      '<div class="svg-world-map-viewport" style="overflow:hidden;border-radius:8px;border:1px solid #b0d4e3;background:' + oceanColor + ';">' +
      '<div class="svg-world-map-loading" style="padding:40px;text-align:center;font-family:sans-serif;color:#555;">Loading map…</div>' +
      '</div>' +
      '<div class="svg-world-map-filters" style="position:absolute;bottom:12px;left:12px;z-index:10;display:none;flex-wrap:wrap;gap:4px;max-width:calc(100% - 24px);padding:0.25rem;border-radius:6px;background:transparent;box-shadow:0 2px 6px rgba(0,0,0,0.15);"></div>' +
      '</figure>'

    this.loadMap(target, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor, markersUrl, renderToken)
  },

  sync: function (object) {
    var target = object && object.exec ? object.exec.element : object
    if (target && target.nodeType) this.render(target)
  },

  load: function (url, callback) {
    if (!url) return callback(null)
    var req = app.xhr.request({ url: url, urlExtension: false })
    req.addEventListener('load', function () { callback(req.status >= 200 && req.status < 300 ? req.responseText : null) })
    req.addEventListener('error', function () { callback(null) })
  },

  loadMap: function (target, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor, markersUrl, renderToken) {
    var self = this, viewport = target.querySelector('.svg-world-map-viewport')

    this.load(markersUrl, function (res) {
      if (target._svgWorldMapRenderToken !== renderToken) return
      var markerData = null
      if (res) {
        try {
          markerData = JSON.parse(res)
          if (Array.isArray(markerData)) markerData = { markers: markerData }
        } catch (e) { }
      }

      self.load('/assets/maps/world.svg', function (svgText) {
        if (target._svgWorldMapRenderToken !== renderToken || !svgText) return
        viewport.innerHTML = svgText
        var svg = viewport.querySelector('svg')
        if (!svg) return

        svg.style.display = 'block'
        svg.style.width = '100%'
        svg.style.height = 'auto'
        svg.style.cursor = 'grab'
        svg.style.userSelect = 'none'
        svg.style.pointerEvents = 'all'
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

        self.initMap(target, svg, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor, markerData)
      })
    })
  },

  initMap: function (target, svg, lat, lng, zoom, fixedMarkerSize, labelText, landColor, borderColor, markerData) {
    var i, landElements = svg.querySelectorAll('.land')
    if (landColor) {
      for (i = 0; i < landElements.length; i++) landElements[i].style.fill = landColor
    }

    var viewBox = (svg.getAttribute('viewBox') || '').split(/[\s,]+/),
      width = parseFloat(viewBox[2]) || 2752.766,
      height = parseFloat(viewBox[3]) || 1537.631,
      X_SCALE = width / 360, Y_SCALE = -(height / 180), X_OFFSET = 1270.5, Y_OFFSET = 787.0

    function toPoint(pLat, pLng) {
      var x = (pLng * X_SCALE) + X_OFFSET, y = (pLat * Y_SCALE) + Y_OFFSET
      return isNaN(x) || isNaN(y) ? null : { x: x, y: y }
    }

    function hasValue(v) { return v !== undefined && v !== null && String(v).trim() !== '' }

    var markerDataItems = markerData && Array.isArray(markerData.markers) ? markerData.markers : [],
      markerItems = []

    for (i = 0; i < markerDataItems.length; i++) {
      var item = markerDataItems[i],
        pt = item && toPoint(parseFloat(item.lat), parseFloat(item.lng)),
        label = item && (item.label !== undefined ? item.label : item.name),
        hasCircle = item && String(item.symbol || '').trim().toLowerCase() === 'circle'

      if (pt && (hasCircle || hasValue(label))) {
        markerItems.push({ data: item, hasMarker: hasCircle, tags: this.normalizeTags(item.tags), x: pt.x, y: pt.y })
      }
    }

    if (!markerItems.length && hasValue(labelText)) {
      var fallback = toPoint(lat, lng) || { x: width / 2, y: height / 2 }
      markerItems.push({ data: { label: labelText }, hasMarker: false, tags: [], x: fallback.x, y: fallback.y })
    }

    var centerPoint = markerData && markerData.center ? toPoint(parseFloat(markerData.center.lat), parseFloat(markerData.center.lng)) : null
    if (!centerPoint && markerItems.length) {
      centerPoint = { x: 0, y: 0 }
      for (i = 0; i < markerItems.length; i++) {
        centerPoint.x += markerItems[i].x
        centerPoint.y += markerItems[i].y
      }
      centerPoint.x /= markerItems.length
      centerPoint.y /= markerItems.length
    }
    if (!centerPoint) centerPoint = toPoint(lat, lng) || { x: width / 2, y: height / 2 }

    var mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    mapGroup.setAttribute('class', 'world-map')

    var svgChildren = []
    for (i = 0; i < svg.childNodes.length; i++) svgChildren.push(svg.childNodes[i])

    for (i = 0; i < svgChildren.length; i++) {
      var child = svgChildren[i]
      if (child.nodeType === 1) {
        var tag = child.nodeName.toLowerCase(), cls = child.getAttribute('class')
        if (tag === 'defs' || cls === 'world-marker-layer') continue
      }
      mapGroup.appendChild(child)
    }
    svg.appendChild(mapGroup)

    var markerLayer = svg.querySelector('.world-marker-layer') || document.createElementNS('http://www.w3.org/2000/svg', 'g')
    markerLayer.setAttribute('class', 'world-marker-layer')
    markerLayer.style.zIndex = '20'
    svg.appendChild(markerLayer)

    for (i = 0; i < markerItems.length; i++) {
      markerItems[i].elements = this.addMarkerWithLabel(markerLayer, markerItems[i].data, markerItems[i].tags)
    }

    var filterValue = target.getAttribute('svgworldmap-filter'),
      filterDefinitions = this.parseFilterDefinitions(filterValue)

    target._svgWorldMap = {
      markerItems: markerItems, filterTags: [], activeFilters: filterDefinitions.length ? [] : null,
      filterDefinitions: filterDefinitions, filterButtons: []
    }

    this.createFilterControls(target, markerItems, filterDefinitions)

    var state = { scale: isNaN(zoom) ? 1 : zoom, x: 0, y: 0, dragging: false, startX: 0, startY: 0 }

    function centerOnMarkers() {
      state.x = (width / 2) - (centerPoint.x * state.scale)
      state.y = (height / 2) - (centerPoint.y * state.scale)
    }
    centerOnMarkers()

    var renderScale = 1, lastScale, lastX, lastY,
      maxZoom = 1000

    function updateMarkerSizes() {
      if (!fixedMarkerSize || renderScale <= 0 || isNaN(renderScale)) return
      for (var idx = 0; idx < markerItems.length; idx++) {
        var m = markerItems[idx], labelSize = parseFloat(m.data.labelSize)
        if (isNaN(labelSize)) labelSize = 11
        m.elements.marker.setAttribute('r', 8 / renderScale)
        m.elements.marker.setAttribute('stroke-width', 2.5 / renderScale)
        m.elements.text.setAttribute('font-size', (labelSize / renderScale) + 'px')
      }
    }

    function refreshRenderScale() {
      if (!fixedMarkerSize) return
      var nextScale = svg.getBoundingClientRect().width / width
      if (nextScale > 0 && !isNaN(nextScale) && nextScale !== renderScale) {
        renderScale = nextScale
        updateMarkerSizes()
      }
    }

    function update() {
      var scale = isNaN(state.scale) ? 1 : state.scale,
        x = isNaN(state.x) ? 0 : state.x,
        y = isNaN(state.y) ? 0 : state.y

      if (scale === lastScale && x === lastX && y === lastY) return
      lastScale = scale; lastX = x; lastY = y
      mapGroup.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + scale + ')')

      for (var idx = 0; idx < markerItems.length; idx++) {
        var item = markerItems[idx], cx = (item.x * scale) + x, cy = (item.y * scale) + y
        item.elements.marker.setAttribute('cx', cx)
        item.elements.marker.setAttribute('cy', cy)
        item.elements.text.setAttribute('x', cx)
        item.elements.text.setAttribute('y', cy + 50)
      }
    }

    function handleResize() { refreshRenderScale(); update() }
    refreshRenderScale()
    window.addEventListener('resize', handleResize)

    function zoomAround(newScale, pointX, pointY) {
      var oldScale = state.scale
      if (newScale === oldScale || isNaN(newScale)) return

      state.x = pointX - (pointX - state.x) * (newScale / oldScale)
      state.y = pointY - (pointY - state.y) * (newScale / oldScale)
      state.scale = newScale
      update()
    }

    target.querySelector('.svg-zoom-in').onclick = function () {
      zoomAround(Math.min(state.scale * 1.5, maxZoom), width / 2, height / 2)
    }
    target.querySelector('.svg-zoom-out').onclick = function () {
      zoomAround(Math.max(state.scale / 1.5, 0.5), width / 2, height / 2)
    }
    target.querySelector('.svg-zoom-reset').onclick = function () {
      state.scale = isNaN(zoom) ? 1 : zoom
      centerOnMarkers()
      update()
    }

    var dragSensitivity = 1.5

    svg.onmousedown = function (e) {
      e.preventDefault()
      state.dragging = true
      state.startX = e.clientX
      state.startY = e.clientY
      state.originX = state.x
      state.originY = state.y

      var rect = svg.getBoundingClientRect()
      state.dragScaleX = rect.width ? width / rect.width : 1
      state.dragScaleY = rect.height ? height / rect.height : 1
      svg.style.cursor = 'grabbing'
    }

    var rafPending = false, rafId = 0
    function handleMouseMove(e) {
      if (!state.dragging) return
      state.x = state.originX + ((e.clientX - state.startX) * dragSensitivity * state.dragScaleX)
      state.y = state.originY + ((e.clientY - state.startY) * dragSensitivity * state.dragScaleY)
      if (!rafPending) {
        rafPending = true
        rafId = requestAnimationFrame(function () { rafPending = false; rafId = 0; update() })
      }
    }

    function handleMouseUp() { state.dragging = false; svg.style.cursor = 'grab' }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    svg.onwheel = function (e) {
      e.preventDefault()

      var rect = svg.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      var scaleX = width / rect.width
      var scaleY = height / rect.height

      var mouseX = (e.clientX - rect.left) * scaleX
      var mouseY = (e.clientY - rect.top) * scaleY

      var zoomFactor = e.deltaY < 0 ? 1.2 : 0.833
      var newScale = Math.min(Math.max(state.scale * zoomFactor, 0.5), maxZoom)

      zoomAround(newScale, mouseX, mouseY)
    }

    target._svgWorldMapCleanup = function () {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (rafPending && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId)
      svg.onmousedown = svg.onwheel = null
    }

    update()
  },

  normalizeTags: function (tags) {
    if (tags === undefined || tags === null) return []
    var values = Array.isArray(tags) ? tags : [tags], normalized = [], i, j
    for (i = 0; i < values.length; i++) {
      var parts = String(values[i]).split(/[,;|]/)
      for (j = 0; j < parts.length; j++) {
        var tag = parts[j].trim().toLowerCase()
        if (tag && tag !== 'all' && normalized.indexOf(tag) === -1) normalized.push(tag)
      }
    }
    return normalized
  },

  parseFilterDefinitions: function (value) {
    if (!value) return []
    var self = this, definitions = [], parts = String(value).split(';'), i
    for (i = 0; i < parts.length; i++) {
      var p = parts[i].trim()
      if (!p) continue
      var named = p.match(/^([^:]+):\s*\[([^\]]*)\]$/)
      if (named) {
        var namedTags = self.normalizeTags(named[2])
        if (namedTags.length) definitions.push({ label: named[1].trim(), tags: namedTags })
      } else {
        var simpleTags = self.normalizeTags(p)
        for (var j = 0; j < simpleTags.length; j++) {
          definitions.push({ label: simpleTags[j], tags: [simpleTags[j]] })
        }
      }
    }
    return definitions
  },

  createFilterControls: function (target, markerItems, filterDefinitions) {
    var self = this, controls = target.querySelector('.svg-world-map-filters'), definitions = filterDefinitions || [], i, j
    if (!controls) return

    if (!definitions.length) {
      var tags = []
      for (i = 0; i < markerItems.length; i++) {
        var mTags = markerItems[i].tags || []
        for (j = 0; j < mTags.length; j++) {
          if (tags.indexOf(mTags[j]) === -1) tags.push(mTags[j])
        }
      }
      for (i = 0; i < tags.length; i++) {
        definitions.push({ label: tags[i], tags: [tags[i]] })
      }
      target._svgWorldMap.filterDefinitions = definitions
      target._svgWorldMap.activeFilters = []
    }

    while (controls.firstChild) controls.removeChild(controls.firstChild)
    if (!definitions.length) return (controls.style.display = 'none')

    var filterSize = target.getAttribute('svgworldmap-filter-size') || '11px',
      hideAll = String(this.config.hideFilterAll).toLowerCase() === 'true' ||
        target.getAttribute('svgworldmap-hidefilterall') === 'true' || target.getAttribute('svgworldmap-hide-all') === 'true',
      buttonsHtml = hideAll ? '' : '<button type="button" svgworldmap-filter-all="" aria-pressed="true">All</button>'

    for (i = 0; i < definitions.length; i++) {
      buttonsHtml += '<button type="button" svgworldmap-filter-index="' + i + '" aria-pressed="false">' + definitions[i].label + '</button>'
    }

    controls.innerHTML = buttonsHtml
    var buttons = controls.querySelectorAll('button')
    target._svgWorldMap.filterButtons = buttons

    for (i = 0; i < buttons.length; i++) {
      var btn = buttons[i]
      btn.style.padding = '6px 8px'
      btn.style.fontSize = filterSize
      btn.style.cursor = 'pointer'
      btn.onclick = function () {
        var idx = this.getAttribute('svgworldmap-filter-index')
        idx === null ? self.filter(target, []) : self.toggleFilter(target, parseInt(idx, 10))
      }
    }

    controls.style.display = 'flex'
  },

  activeFilterTags: function (state) {
    var tags = []
    for (var i = 0; i < state.activeFilters.length; i++) {
      tags = tags.concat(state.filterDefinitions[state.activeFilters[i]].tags)
    }
    return this.normalizeTags(tags)
  },

  setActiveFilters: function (state, filterTags) {
    state.activeFilters = []
    for (var i = 0; i < state.filterDefinitions.length; i++) {
      var def = state.filterDefinitions[i], match = false
      for (var j = 0; j < def.tags.length; j++) {
        if (filterTags.indexOf(def.tags[j]) !== -1) { match = true; break }
      }
      if (match) state.activeFilters.push(i)
    }
  },

  updateFilterButtons: function (target) {
    var state = target._svgWorldMap, buttons = state.filterButtons || [], active = state.activeFilters || []
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i], idx = btn.getAttribute('svgworldmap-filter-index'),
        sel = idx === null ? active.length === 0 : active.indexOf(parseInt(idx, 10)) !== -1
      btn.setAttribute('aria-pressed', sel ? 'true' : 'false')
      btn.style.fontWeight = sel ? 'bold' : 'normal'
      btn.style.opacity = sel ? '1' : '0.65'
    }
  },

  toggleFilter: function (target, index) {
    var state = target && target._svgWorldMap
    if (!state || !state.filterDefinitions[index]) return
    var active = state.activeFilters || [], idx = active.indexOf(index)
    if (idx === -1) active.push(index)
    else active.splice(idx, 1)
    state.activeFilters = active
    return this.applyFilter(target, this.activeFilterTags(state))
  },

  filter: function (object, tags) {
    var target = object && object.exec ? object.exec.element || (object.options && object.options.element) : object
    if (!target || !target.nodeType) return

    var state = target._svgWorldMap
    if (!state) {
      if (tags === undefined || tags === null) target.removeAttribute('svgworldmap-filter')
      else target.setAttribute('svgworldmap-filter', tags)
      return
    }

    var filterTags = this.normalizeTags(tags)
    this.setActiveFilters(state, filterTags)
    return this.applyFilter(target, filterTags)
  },

  applyFilter: function (target, filterTags) {
    var state = target._svgWorldMap, visible = 0
    state.filterTags = filterTags

    for (var i = 0; i < state.markerItems.length; i++) {
      var item = state.markerItems[i], matches = !filterTags.length
      if (!matches) {
        var itemTags = item.tags || []
        for (var j = 0; j < filterTags.length; j++) {
          if (itemTags.indexOf(filterTags[j]) !== -1) { matches = true; break }
        }
      }
      item.elements.marker.style.display = matches && item.hasMarker ? '' : 'none'
      item.elements.text.style.display = matches ? '' : 'none'
      if (matches) visible++
    }

    this.updateFilterButtons(target)
    return visible
  },

  addMarkerWithLabel: function (markerLayer, data, tags) {
    var ns = 'http://www.w3.org/2000/svg', marker = document.createElementNS(ns, 'circle'), text = document.createElementNS(ns, 'text')
    data = data || {}
    var label = data.label !== undefined ? data.label : (data.name || ''),
      hasMarker = String(data.symbol || '').trim().toLowerCase() === 'circle',
      labelSize = data.labelSize && String(data.labelSize).trim() !== '' ? data.labelSize : '11px'

    tags = tags || this.normalizeTags(data.tags)

    marker.setAttribute('r', '8')
    marker.setAttribute('fill', data.color || 'transparent')
    marker.setAttribute('stroke', data.borderColor || '#ffffff')
    marker.setAttribute('stroke-width', '2.5')
    marker.setAttribute('class', 'svg-world-map-marker')
    marker.setAttribute('tags', tags.join(','))
    marker.style.zIndex = '20'
    marker.style.display = hasMarker ? '' : 'none'
    markerLayer.appendChild(marker)

    text.textContent = label
    text.setAttribute('font-size', String(labelSize))
    text.setAttribute('fill', data.labelColor || '#1a365d')
    text.setAttribute('font-weight', 'bold')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-family', 'sans-serif')
    text.setAttribute('pointer-events', 'none')
    markerLayer.appendChild(text)

    return { marker: marker, text: text }
  }
}