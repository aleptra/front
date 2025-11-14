app.plugin.filtersearch = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      { container: document }, // default container
      options.element
    )

    // Initialize internal match count per section
    this.sectionMatches = {}
  },

  run: function (object) {
    var term = (object.exec && object.exec.value) || ''
    var rows = app.element.select('[' + this.plugin + '-select]')
    var sections = app.element.select('[filtersearch--section]')

    // Reset match counts per section
    this.sectionMatches = {}

    // Create a map from row to section index
    var rowSectionMap = new Map()
    for (var s = 0; s < sections.length; s++) {
      var section = sections[s]
      var sectionRows = section.querySelectorAll('[' + this.plugin + '-select]')
      for (var r = 0; r < sectionRows.length; r++) {
        rowSectionMap.set(sectionRows[r], s)
      }
      // Initialize count for this section
      this.sectionMatches[s] = 0
    }

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var text = row.textContent || row.innerText || ''
      var match = text.toLowerCase().indexOf(term.toLowerCase()) > -1
      row.style.display = match || !term ? '' : 'none'

      var sectionIndex = rowSectionMap.get(row)
      if (sectionIndex !== undefined && (match || !term)) {
        this.sectionMatches[sectionIndex]++
      }
    }

  },

  clear: function () {
    var rows = app.element.select('[' + this.plugin + '-select]')
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = ''
    }

    // Reset match counts per section based on section rows
    var sections = app.element.select('[filtersearch--section]')
    this.sectionMatches = {}
    for (var s = 0; s < sections.length; s++) {
      var sectionRows = sections[s].querySelectorAll('[' + this.plugin + '-select]')
      this.sectionMatches[s] = sectionRows.length
    }
  }
}