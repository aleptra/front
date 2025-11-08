'use strict'

app.module.overlay = {
  dialog: function (object) {
    var dialog = object.exec.element
    dialog.showModal()
    dom.show(dialog)
  },

  close: function (object) {
    var overlay = object.exec.element
    overlay.close()
    dom.hide(dialog)
  }
}