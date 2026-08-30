'use strict'

app.module.form = {

  __autoload: function (options) {
    this.module = options.name

    var self = this
    var scrolled = false

    document.addEventListener('invalid', function (e) {
      e.preventDefault()
      if (!scrolled) {
        e.target.scrollIntoView({ block: 'center' })
        e.target.focus()
        scrolled = true
        setTimeout(function () { scrolled = false }, 100)
      }
      self._showTip(e.target)
    }, true)

    document.addEventListener('submit', function (e) {
      var form = e.target || e.srcElement
      var ms = form && form.getAttribute && parseInt(form.getAttribute('form-throttle'), 10)
      if (!ms) return

      if (form._formThrottled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      form._formThrottled = true
      app.wait(ms, function () { form._formThrottled = false })
    }, true)
  },

  _showTip: function (el) {
    var raw = el.getAttribute(this.module + '-invalid') || ''
    var message = app.element.extractBracketValues(raw)
    var targetId = message ? raw.split(':')[0] : ''
    var target = targetId ? app.element.select(targetId) : null

    if (!message) message = raw || el.validationMessage || ''
    if (!target) return

    target.textContent = message
    el.addEventListener('input', function () { target.textContent = '' }, { once: true })
    el.addEventListener('change', function () { target.textContent = '' }, { once: true })
  }
}
