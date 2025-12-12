'use strict'

app.plugin.clipboard = {
  _marker: '__clipboard_copied',

  /**
   * clipboard-copy
   * Called by: click="clipboard-copy:#" or clipboard-copy=".selector"
   *
   * @param {HTMLElement} element - The element that triggered the event.
   * @param {string} value - The selector or '#' for self-element.
   */
  copy: function (element, value) {
    var target = app.element.resolveCall(element)

    // Avoid multiple executions on the same render cycle
    if (element[this._marker]) return

    var text = target.textContent

    if (!text) return

    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
    } else {
      // Fallback for old browsers
      var temp = document.createElement('textarea')
      temp.value = text
      temp.style.position = 'fixed'
      temp.style.opacity = '0'
      document.body.appendChild(temp)
      temp.select()
      try { document.execCommand('copy'); } catch (e) { }
      document.body.removeChild(temp)
    }

    // Mark as executed to avoid duplicate runs in the same flow
    element[this._marker] = true
  },

  /**
   * clipboard-paste
   * Called by: click="clipboard-paste:#" or clipboard-paste="input"
   */
  paste: function (element, value) {
    // Determine target
    if (value && value !== '#') {
      element = app.element.select(value)
    }
    if (!element) return

    // Avoid duplicate execution
    if (element[this._marker]) return

    // Modern async clipboard API
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(function (text) {
        app.element.set(element, text)
      })
    } else {
      // Cannot paste in older browsers — empty fallback
      app.element.set(element, '')
    }

    element[this._marker] = true
  }
}