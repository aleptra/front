'use strict'

app.module.overlay = {
  dialog: function (object) {
    var dialog = object.exec.element,
      srcEl = object.options && object.options.srcElement

    dialog.innerHTML = dialog.originalHtml

    // Pass overlay-bind value from source element to dialog input with matching overlay-bind.
    if (srcEl) {
      var srcBind = srcEl.getAttribute('overlay-bind')
      if (srcBind) {
        var inputs = dialog.querySelectorAll('[overlay-bind]')
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].value = srcBind
          inputs[i].setAttribute('value', srcBind)
        }
      }
    }

    dialog.showModal()
    dom.show(object)
  },

  close: function (object) {
    var dialog = object.exec.element
    dialog.close()
    dom.hide(object)
  }
}
