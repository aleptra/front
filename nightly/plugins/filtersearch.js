app.plugin.filtersearch = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      { container: document },
      options.element
    )
    this.sectionMatches = {}
  },

  run: function (object) {
    var term = (object.exec && object.exec.value || '').trim().toLowerCase()
    var rows = app.element.select('[' + this.plugin + '-select]')
    var i, row, text, matches, countKey

    // Reset counts
    this.sectionMatches = {}

    if (!rows || rows.length === 0) {
      return
    }

    var totalMatches = 0

    // Single pass: filter rows + count per section
    for (i = 0; i < rows.length; i++) {
      row = rows[i]
      text = (row.textContent || '').trim()
      matches = (term === '' || text.toLowerCase().indexOf(term) !== -1)

      app.call(matches ? 'show' : 'hide', { element: row })

      if (matches) {
        totalMatches++
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
        var counters = app.element.select('[' + this.plugin + '-count="' + key + '"]')
        if (counters) {
          if (!counters.length) counters = [counters] // Normalize counters to an array to support single-element sections
          for (i = 0; i < counters.length; i++) {
            app.variables.update.attributes(counters[i], key, count, { reset: true })
          }
        }
      }
    }

    // Optional clean debug
    //console.log('Filter matches:', totalMatches, 'Term:', term)
    //console.log('Section counts:', this.sectionMatches)
  }
}