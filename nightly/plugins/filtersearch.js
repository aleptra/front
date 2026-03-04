app.plugin.filtersearch = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.sectionMatches = {}
    this.totalMatches = 0
  },

  run: function (object) {
    var srcElement = object.options && object.options.element
    var term = (srcElement && srcElement.value !== undefined
      ? srcElement.value
      : object.exec && object.exec.value || ''
    ).trim().toLowerCase()

    var hasTarget = object.exec && object.exec.element && object.exec.element !== srcElement
    var container = hasTarget ? object.exec.element : document

    var found = hasTarget
      ? app.element.find(container, '[' + this.plugin + '-select]')
      : app.element.select('[' + this.plugin + '-select]', true)

    // Normalize to a plain array
    var rows = found ? (found.length !== undefined ? [].slice.call(found) : [found]) : []
    var i, row, text, matches, countKey

    // Reset counts
    this.sectionMatches = {}
    this.totalMatches = 0

    if (rows.length === 0) {
      return
    }

    // Single pass: filter rows + count per section
    for (i = 0; i < rows.length; i++) {
      row = rows[i]
      text = (row.textContent || '').trim()
      matches = (term === '' || text.toLowerCase().indexOf(term) !== -1)

      app.call(matches ? 'show' : 'hide', { element: row })

      if (matches) {
        this.totalMatches++
      }

      countKey = row.getAttribute('filtersearch--count')
      if (countKey) {
        if (!this.sectionMatches.hasOwnProperty(countKey)) {
          this.sectionMatches[countKey] = 0
        }
        if (matches) {
          this.sectionMatches[countKey]++
        }
      }
    }

    // Update all counter elements
    var key
    for (key in this.sectionMatches) {
      if (this.sectionMatches.hasOwnProperty(key)) {
        var count = this.sectionMatches[key]
        var found = hasTarget
          ? app.element.find(container, '[' + this.plugin + '-count="' + key + '"]')
          : app.element.select('[' + this.plugin + '-count="' + key + '"]', true)
        var counters = found ? (found.length !== undefined ? [].slice.call(found) : [found]) : []
        for (i = 0; i < counters.length; i++) {
          app.variables.update.attributes(counters[i], key, count, { reset: true })
        }
      }
    }

    // data-onempty="#someElement" on the container — show when no matches, hide otherwise
    var onempty = hasTarget && container.getAttribute(this.plugin + '-onempty')
    if (onempty) {
      var emptyEl = app.element.select(onempty)
      if (emptyEl) {
        app.call(this.totalMatches === 0 ? 'show' : 'hide', { element: emptyEl })
      }
    }
  }
}