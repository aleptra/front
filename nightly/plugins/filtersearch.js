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
    var term = (object.exec && object.exec.value) || '',
      termLower = term.trim().toLowerCase()

    var rows = app.element.select('[' + this.plugin + '-select]')

    // Reset
    this.sectionMatches = {}

    // Initialize counts
    for (var i = 0; i < rows.length; i++) {
      var countAttr = rows[i].getAttribute('filtersearch--count')
      if (countAttr && !this.sectionMatches.hasOwnProperty(countAttr)) {
        this.sectionMatches[countAttr] = 0
      }
    }

    var matchCount = 0 // total matches for debug

    // Filter + count
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var text = (row.textContent || row.innerText || '').trim()
      var match = termLower === '' || text.toLowerCase().includes(termLower)

      // Show/hide
      app.call(match ? 'show' : 'hide', { element: row })

      if (match) matchCount++

      var countAttr = row.getAttribute('filtersearch--count')
      if (countAttr && match) {
        this.sectionMatches[countAttr]++
      }
    }

    // Update variables
    for (var key in this.sectionMatches) {
      var count = this.sectionMatches[key]
      var elements = app.element.select('[' + this.plugin + '-count="' + key + '"]')
      for (var e = 0; e < elements.length; e++) {
        app.variables.update.attributes(elements[e], key, count, { reset: true })
      }
    }
  },
}