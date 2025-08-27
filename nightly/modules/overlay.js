'use strict'

app.module.overlay = {
    // Experimental
  dialog: function (object) {
    var dialog = dom.get(object.exec.value)
    if (dialog.open) {
      dialog.close()
    } else {
      dialog.showModal()
    }
  } 
}