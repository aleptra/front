'use strict'

app.module.screen = {
  __autoload: function (options) {
    this.module = options.name
    this.currentBp = null
    this._resizeTimer = null

    this.updateDimensions()
    var self = this
    var onResize = function () {
      self.updateDimensions()
      self.checkBreakpoints()
    }

    var debounced = function () {
      clearTimeout(self._resizeTimer)
      self._resizeTimer = setTimeout(onResize, 100)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debounced)
      window.visualViewport.addEventListener('scroll', debounced)
    }
    window.addEventListener('resize', debounced)
    window.addEventListener('orientationchange', debounced)
  },

  breakpoints: {
    xs: [0, 399], sm: [400, 575], md: [576, 767],
    lg: [768, 991], xl: [992, 1199], xxl: [1200, Infinity]
  },

  bpOrder: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

  updateDimensions: function () {
    var vv = window.visualViewport || null
    app.globals.windowHeight = (vv && vv.height) || window.innerHeight
    app.globals.windowWidth = (vv && vv.width) || window.innerWidth
  },

  getCurrentBreakpoint: function () {
    var w = app.globals.windowWidth
    var order = this.bpOrder
    for (var i = 0; i < order.length; i++) {
      var k = order[i]
      var r = this.breakpoints[k]
      if (w >= r[0] && w <= r[1]) return k
    }
    return null
  },

  checkBreakpoints: function () {
    var bp = this.getCurrentBreakpoint()
    if (bp && bp !== this.currentBp) {
      this.currentBp = bp
      this.applyForBreakpoint(bp)
    }
  },

  applyForBreakpoint: function (bp) {
    var order = this.bpOrder
    var attrPrefix = this.module + '-'
    var selParts = []
    for (var i = 0; i < order.length; i++) {
      selParts.push('[' + attrPrefix + order[i] + ']')
    }
    var els = dom.get(selParts.join(','), true) || []
    for (var j = 0; j < els.length; j++) {
      var act = this.findClosestAttr(els[j], bp)
      if (act) app.call(act, { element: els[j] })
    }
  },

  findClosestAttr: function (el, bp) {
    var idx = this.bpOrder.indexOf(bp)
    var prefix = this.module + '-'
    for (var i = idx; i >= 0; i--) {
      var name = prefix + this.bpOrder[i]
      var val = el.getAttribute && el.getAttribute(name)
      if (val) return val
    }
    return null
  },

  _initRun: function (el) {
    var bp = this.getCurrentBreakpoint()
    if (!bp) return
    var val = this.findClosestAttr(el, bp)
    if (val) {
      this.currentBp = bp
      app.call(val, { element: el })
    }
  }
}

// generate xs(), sm(), ... methods
for (var i = 0; i < app.module.screen.bpOrder.length; i++) {
  (function (bp) {
    app.module.screen[bp] = function (el) { this._initRun(el) }
  })(app.module.screen.bpOrder[i])
}