'use strict'

app.module.screen = {
  __autoload: function (options) {
    this.module = options.name
    var self = this

    // initialize globals
    app.globals.windowHeight = window.innerHeight
    app.globals.windowWidth = window.innerWidth

    // keep track of active breakpoint
    this.currentBp = null

    // re-check on resize
    app.listeners.add(window, 'resize', function () {
      app.globals.windowHeight = window.innerHeight
      app.globals.windowWidth = window.innerWidth
      self.checkBreakpoints()
    })
  },

  // define breakpoint ranges
  breakpoints: {
    xs: [0, 399],
    sm: [400, 575],
    md: [576, 767],
    lg: [768, 991],
    xl: [992, 1199],
    xxl: [1200, Infinity]
  },

  // ordered list of breakpoints (for fallback search)
  bpOrder: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],

  checkBreakpoints: function () {
    var w = app.globals.windowWidth
    var bp = null

    // find matching breakpoint
    for (var key in this.breakpoints) {
      var range = this.breakpoints[key]
      if (w >= range[0] && w <= range[1]) {
        bp = key
        break
      }
    }

    // fire event only if breakpoint changed
    if (bp && bp !== this.currentBp) {
      this.currentBp = bp
      this.applyForBreakpoint(bp)
    }
  },

  // finds closest available attribute for each element (fallback logic)
  applyForBreakpoint: function (bp) {
    var selector = ''
    for (var i = 0; i < this.bpOrder.length; i++) {
      selector += (i > 0 ? ',' : '') + '[' + this.module + '-' + this.bpOrder[i] + ']'
    }

    var elements = dom.get(selector, true)
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i]
      var action = this.findClosestAttr(el, bp)
      if (action) {
        app.call(action, { element: el })
      }
    }
  },

  // search fallback: current bp → smaller ones
  findClosestAttr: function (el, bp) {
    var idx = this.bpOrder.indexOf(bp)
    for (var i = idx; i >= 0; i--) {
      var attrName = this.module + '-' + this.bpOrder[i]
      var value = el.getAttribute(attrName)
      if (value) return value
    }
    return null
  },

  _initRun: function (attr, element) {
    var w = app.globals.windowWidth
    var bp = null
    for (var key in this.breakpoints) {
      var range = this.breakpoints[key]
      if (w >= range[0] && w <= range[1]) {
        bp = key
        break
      }
    }

    var value = this.findClosestAttr(element, bp)
    if (value) {
      this.currentBp = bp
      app.call(value, { element: element })
    }
  },

  xs: function (element) { this._initRun('xs', element) },
  sm: function (element) { this._initRun('sm', element) },
  md: function (element) { this._initRun('md', element) },
  lg: function (element) { this._initRun('lg', element) },
  xl: function (element) { this._initRun('xl', element) },
  xxl: function (element) { this._initRun('xxl', element) }
}