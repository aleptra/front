'use strict'

app.plugin.progressbar = {

  __autoload: function () {
    var elements = document.querySelectorAll('progress')
    for (var i = 0; i < elements.length; i++) {
      this._apply(elements[i])
    }
  },

  _apply: function (el) {
    if (!el.id) dom.setUniqueId(el)

    var radius = el.getAttribute('radius')
    var bgcolor = el.getAttribute('bgcolor') || el.getAttribute('color')
    var height = el.getAttribute('height')

    if (!radius && !bgcolor && !height) return

    var id = '#' + el.id
    var rules = ''

    // Base + bar track
    var base = ''
    if (radius) base += 'border-radius:' + radius + ';overflow:hidden;'
    if (height) base += 'height:' + height + ';'
    if (base) {
      rules += id + ',' + id + '::-webkit-progress-bar{' + base + '}'
      rules += id + '::-moz-progress-bar{' + base + '}'
    }

    // Fill color
    if (bgcolor) {
      rules += id + '::-webkit-progress-value{background:' + bgcolor + ';'
      if (radius) rules += 'border-radius:' + radius + ';'
      rules += '}'
      rules += id + '::-moz-progress-bar{background:' + bgcolor + ';}'
    }

    var s = document.getElementById('pb-' + el.id)
    if (!s) { s = document.createElement('style'); s.id = 'pb-' + el.id; document.head.appendChild(s) }
    s.innerHTML = rules
  }
}
