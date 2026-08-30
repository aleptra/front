'use strict'

app.plugin.clipboard = {
  _marker: '__clipboard_copied',
  _lastSelection: '',

  __autoload: function (options) {
    this.config = app.config.get(
      options.name + '-',
      { range: 'false' },
      options.element
    )

    var self = this
    document.addEventListener('selectionchange', function () {
      var text = window.getSelection().toString()
      if (text) self._lastSelection = text
    })
  },

  copy: function (element, value) {
    var target = app.element.resolveCall(element)
    // Avoid multiple executions on the same render cycle
    if (element[this._marker]) return

    // Check element-level override, fall back to global config
    var range = target.getAttribute('clipboard--range') || this.config.range
    var text = (range === 'true' && this._lastSelection) || target.textContent
    this._lastSelection = ''

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
      try { document.execCommand('copy') } catch (e) { }
      document.body.removeChild(temp)
    }

    // Mark as executed to avoid duplicate runs in the same flow
    element[this._marker] = true
  },

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