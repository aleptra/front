'use strict'

app.module.overlay = {
  dialog: function (object) {
    var dialog = app.element.select(object.exec.value)
    dialog.showModal()
    dom.show(dialog)
  },

  close: function (object) {
    var overlay = app.element.select(object.exec.value)
    overlay.close()
    dom.hide(dialog)
  }
}