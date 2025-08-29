'use strict'

app.module.overlay = {
    // Experimental
  dialog: function (object) {
    var dialog = dom.get(object.exec.value)
    dialog.showModal()
  },

  close: function (object) {
    var overlay = dom.get(object.exec.value)
    overlay.close()
  }

}