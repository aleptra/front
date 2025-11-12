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
    var term = (object.exec && object.exec.value) || ''
    // Filter rows
    var rows = app.element.select('[' + this.plugin + '-select]')
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var text = row.textContent || row.innerText || ''
      row.style.display = text.toLowerCase().indexOf(term.toLowerCase()) > -1 ? '' : 'none'
    }
  },

  // Clear all filters
  clear: function () {
    var rows = app.element.select('[' + this.plugin + '-select] > tr')
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = ''
    }
  }
}