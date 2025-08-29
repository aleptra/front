'use strict'

app.module.overlay = {
  dialog: function (object) {
    var dialog = dom.get(object.exec.value)
    dialog.showModal()
    dom.show(dialog)
  },

  close: function (object) {
    var overlay = dom.get(object.exec.value)
    overlay.close()
    dom.hide(dialog)
  }
}