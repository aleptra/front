'use strict'

app.module.overlay = {
  dialog: function (object) {
    var dialog = object.exec.element
    dialog.innerHTML = dialog.originalHtml
    dialog.showModal()
    dom.show(object)
  },

  close: function (object) {
    var dialog = object.exec.element
    dialog.close()
    dom.hide(object)
  }
}