'use strict'

app.plugin.progressbar = {

  set: function (object) {
    var el = object && object.exec ? object.exec.element : object
    if (!el || el.localName !== 'progress') return
    if (!el.id) dom.setUniqueId(el)

    var radius = el.getAttribute('radius'),
      fill = el.getAttribute('color'),
      track = el.getAttribute('bgcolor')

    if (!radius && !fill && !track) return

    // Clear inline styles the core apply() set — plugin handles these via pseudo-elements
    if (fill) el.style.color = ''
    if (track) el.style.backgroundColor = ''

    var id = '#' + el.id
    var rules = id + '{-webkit-appearance:none;appearance:none}'

    if (radius) {
      rules += id + '{border-radius:' + radius + ';overflow:hidden}'
      rules += id + '::-webkit-progress-bar{border-radius:' + radius + ';overflow:hidden}'
      rules += id + '::-webkit-progress-value{border-radius:' + radius + '}'
      rules += id + '::-moz-progress-bar{border-radius:' + radius + '}'
    }

    if (track) {
      rules += id + '::-webkit-progress-bar{background:' + track + '}'
    }

    if (fill) {
      rules += id + '::-webkit-progress-value{background:' + fill + '}'
      rules += id + '::-moz-progress-bar{background:' + fill + '}'
    }

    var s = document.getElementById('pb-' + el.id)
    if (!s) { s = document.createElement('style'); s.id = 'pb-' + el.id; document.head.appendChild(s) }
    s.innerHTML = rules
  }
}
