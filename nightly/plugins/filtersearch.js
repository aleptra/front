app.plugin.filtersearch = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      {
        container: document // default container
      },
      options.element
    )
  },

  run: function (object) {
    // Get input element and its current value
    var el = object.exec && object.exec.element
    if (!el) return

    var term = (object.exec && object.exec.value) || ''
    var container = this.config.container || document

    // If input is empty, clear all rows
    if (!term) {
      this.clear(container)
      return
    }

    // Filter rows inside all <tbody data-iterate>
    var rows = container.querySelectorAll('tbody[data-iterate] > tr')
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var text = row.textContent || row.innerText || ''
      row.style.display = text.toLowerCase().indexOf(term.toLowerCase()) > -1 ? '' : 'none'
    }
  },

  // Clear all filters
  clear: function (container) {
    container = container || this.config.container || document
    var rows = container.querySelectorAll('tbody[data-iterate] > tr')
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = ''
    }
  }
}