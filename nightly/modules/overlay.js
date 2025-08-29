'use strict'

app.module.overlay = {
  dialog: function (object) {
    var dialog = dom.get(object.exec.value)
    dom.show(dialog)
    dialog.showModal()
  },

  close: function (object) {
    var overlay = dom.get(object.exec.value)
    dom.hide(dialog)
    overlay.close()
  }
}