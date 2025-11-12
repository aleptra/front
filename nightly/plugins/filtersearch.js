app.plugin.filterSearch = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      {
        container: document,    // default container
      },
      options.element
    )
  },

  set: function (options) {
    var term = options.term || ''
    if (!term) return
    var container = options.container || this.config.container

    // Get only rows with data-iterate (filterable rows)
    var rows = container.querySelectorAll('tbody[data-iterate] > tr')

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var text = row.textContent || row.innerText || ''
      row.style.display = text.toLowerCase().includes(term.toLowerCase()) ? '' : 'none'
    }
  },

  clear: function (container) {
    container = container || this.config.container
    var rows = container.querySelectorAll('tbody[data-iterate] > tr')
    rows.forEach(row => row.style.display = '')
  }
}