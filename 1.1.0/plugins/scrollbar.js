'use strict'

app.plugin.scrollbar = {

  __autoload: function (options) {
    this.plugin = options.name + '-'

    this.globalConfig = app.config.get(this.plugin, {
      width: 'thin', // Default to keyword
      radius: 4,
      thumb: 'rgba(255,255,255,.25)',
      track: 'transparent',
      hover: 'rgba(255,255,255,.45)'
    }, options.element)
  },

  set: function (object) {
    var el = object && object.exec ? object.exec.element : object
    if (!el || !el.nodeType) return

    var attr = el.getAttribute('scrollbar--set') || ''
    var elementConfig = this._parseConfig(attr)
    var activeConfig = this._merge(this.globalConfig, elementConfig)

    this._apply(el, activeConfig)
  },

  _merge: function (base, overlay) {
    var res = {}
    var key
    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) res[key] = base[key]
    }
    for (key in overlay) {
      if (Object.prototype.hasOwnProperty.call(overlay, key)) res[key] = overlay[key]
    }
    return res
  },

  _parseConfig: function (str) {
    var cfg = {}
    if (!str) return cfg
    var pairs = str.split(';')
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split(':')
      if (kv.length === 2) {
        var key = kv[0].trim()
        var value = kv[1].trim()
        if (key) cfg[key] = value
      }
    }
    return cfg
  },

  _apply: function (el, config) {
    if (!el) return

    var style = getComputedStyle(el)
    if (style.overflow === 'visible') el.style.overflow = 'auto'

    var id = el.getAttribute('data-scrollbar-id')
    if (!id) {
      id = 'sb-' + Math.random().toString(36).substr(2, 9)
      el.setAttribute('data-scrollbar-id', id)
    }

    var css = this._buildStyles('[data-scrollbar-id="' + id + '"]', config)

    var styleId = 'scrollbar-style-' + id
    var existing = document.getElementById(styleId)
    if (existing) existing.parentNode.removeChild(existing)

    var styleEl = document.createElement('style')
    styleEl.id = styleId
    styleEl.type = 'text/css'

    if (styleEl.styleSheet) {
      styleEl.styleSheet.cssText = css
    } else {
      styleEl.appendChild(document.createTextNode(css))
    }
    document.getElementsByTagName('head')[0].appendChild(styleEl)
  },

  _buildStyles: function (scope, c) {
    var w = c.width
    var r = parseInt(c.radius, 10) || 4

    // Webkit needs pixels, Firefox needs keywords
    var webkitW = 8
    var ffW = 'thin'

    if (w === 'auto') {
      webkitW = 14
      ffW = 'auto'
    } else if (w === 'thin') {
      webkitW = 8
      ffW = 'thin'
    } else if (w === 'none') {
      webkitW = 0
      ffW = 'none'
    } else {
      // Fallback if someone still puts a number
      webkitW = parseInt(w, 10) || 8
      ffW = webkitW > 10 ? 'auto' : 'thin'
    }

    return scope + ' { ' +
      'scrollbar-width: ' + ffW + ' !important; ' +
      'scrollbar-color: ' + c.thumb + ' ' + c.track + ' !important; ' +
      '} ' +
      scope + '::-webkit-scrollbar { ' +
      'width: ' + webkitW + 'px !important; ' +
      'height: ' + webkitW + 'px !important; ' +
      '} ' +
      scope + '::-webkit-scrollbar-track { ' +
      'background: ' + c.track + ' !important; ' +
      '} ' +
      scope + '::-webkit-scrollbar-thumb { ' +
      'background: ' + c.thumb + ' !important; ' +
      'border-radius: ' + r + 'px !important; ' +
      '} ' +
      scope + '::-webkit-scrollbar-thumb:hover { ' +
      'background: ' + c.hover + ' !important; ' +
      '}'
  }
}