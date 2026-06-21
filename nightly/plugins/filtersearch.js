app.plugin.filtersearch = {
  __autoload: function (options) {
    this.plugin = options.name + '--'
    this.sectionMatches = {}
    this.totalMatches = 0
  },

  run: function (object) {
    var srcElement = object.options && object.options.element
    var hasTarget = object.exec && object.exec.element && object.exec.element !== srcElement
    var container = hasTarget ? object.exec.element : document
    var term = ''

    if (srcElement && srcElement.type === 'text') {
      term = (srcElement.value || '').trim().toLowerCase()
    } else if (hasTarget) {
      var filterInput = app.element.select('[' + this.plugin + 'input]')
      term = filterInput ? (filterInput.value || '').trim().toLowerCase() : ''
    }

    var found = hasTarget
      ? app.element.find(container, '*[' + this.plugin + 'select]')
      : app.element.select('[' + this.plugin + 'select]', true)

    var rows = found ? (found.length !== undefined ? [].slice.call(found) : [found]) : []
    if (!rows.length) return

    var checkboxes = app.element.select('input[type="checkbox"][' + this.plugin + 'group]', true)
    var filters = {}
    var hasActiveFilters = false
    if (checkboxes) {
      var cbs = checkboxes.length !== undefined ? [].slice.call(checkboxes) : [checkboxes]
      for (var c = 0; c < cbs.length; c++) {
        var group = cbs[c].getAttribute(this.plugin + 'group')
        if (group && cbs[c].checked) {
          filters[group] = true
          hasActiveFilters = true
        }
      }
    }

    this.sectionMatches = {}
    this.totalMatches = 0

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var matches = term === '' || (row.textContent || '').toLowerCase().indexOf(term) !== -1

      if (matches && hasActiveFilters) {
        var marker = row.querySelector('[' + this.plugin + 'marker]')
        var hasMarker = marker && marker.textContent.trim().length > 0
        matches = (filters._hasvalue && hasMarker) || (filters._empty && !hasMarker)
      }

      app.call(matches ? 'show' : 'hide', { element: row })
      if (matches) this.totalMatches++

      var countKey = row.getAttribute(this.plugin + 'count')
      if (countKey) {
        if (!this.sectionMatches.hasOwnProperty(countKey)) {
          this.sectionMatches[countKey] = 0
        }
        if (matches) this.sectionMatches[countKey]++
      }
    }

    var key
    for (key in this.sectionMatches) {
      if (this.sectionMatches.hasOwnProperty(key)) {
        var count = this.sectionMatches[key]
        var els = hasTarget
          ? app.element.find(container, '*[' + this.plugin + 'count="' + key + '"]')
          : app.element.select('[' + this.plugin + 'count="' + key + '"]', true)
        var counters = els ? (els.length !== undefined ? [].slice.call(els) : [els]) : []
        for (i = 0; i < counters.length; i++) {
          app.variables.update.attributes(counters[i], key, count, { reset: true })
        }
      }
    }

    var onempty = hasTarget && container.getAttribute(this.plugin + 'onempty')
    if (onempty) {
      var emptyEl = app.element.select(onempty)
      if (emptyEl) app.call(this.totalMatches === 0 ? 'show' : 'hide', { element: emptyEl })
    }
  }
}
