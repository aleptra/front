'use strict'

app.module.screen = {
  __autoload: function (options) {
    this.module = options.name
    this.currentBp = null
    this.updateDimensions()

    var self = this
    app.listeners.add(window, 'resize', function () {
      self.updateDimensions()
      self.checkBreakpoints()
    })
  },

  breakpoints: {
    xs: [0, 399], sm: [400, 575], md: [576, 767],
    lg: [768, 991], xl: [992, 1199], xxl: [1200, Infinity]
  },

  bpOrder: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

  updateDimensions: function () {
    app.globals.windowHeight = window.innerHeight
    app.globals.windowWidth = window.innerWidth
  },

  getCurrentBreakpoint: function () {
    var w = app.globals.windowWidth, bp = null
    for (var k in this.breakpoints) {
      if (this.breakpoints.hasOwnProperty(k)) {
        var r = this.breakpoints[k]
        if (w >= r[0] && w <= r[1]) { bp = k; break }
      }
    }
    return bp
  },

  checkBreakpoints: function () {
    var bp = this.getCurrentBreakpoint()
    if (bp && bp !== this.currentBp) {
      this.currentBp = bp
      this.applyForBreakpoint(bp)
    }
  },

  applyForBreakpoint: function (bp) {
    var selector = []
    for (var i = 0; i < this.bpOrder.length; i++) {
      selector.push('[' + this.module + '-' + this.bpOrder[i] + ']')
    }
    var els = dom.get(selector.join(','), true)
    for (var j = 0; j < els.length; j++) {
      var act = this.findClosestAttr(els[j], bp)
      if (act) app.call(act, { element: els[j] })
    }
  },

  findClosestAttr: function (el, bp) {
    for (var i = this.bpOrder.indexOf(bp); i >= 0; i--) {
      var val = el.getAttribute(this.module + '-' + this.bpOrder[i])
      if (val) return val
    }
    return null
  },

  _initRun: function (el) {
    var bp = this.getCurrentBreakpoint()
    if (!bp) return
    var val = this.findClosestAttr(el, bp)
    if (val) { this.currentBp = bp; app.call(val, { element: el }) }
  }
}

// auto-generate xs(), sm(), ... methods
for (var i = 0; i < app.module.screen.bpOrder.length; i++) {
  (function (bp) {
    app.module.screen[bp] = function (el) { this._initRun(el) }
  })(app.module.screen.bpOrder[i])
}