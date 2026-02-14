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

    function updateViewport() {
      var vv = window.visualViewport || null
      var h = (vv && vv.height) || window.innerHeight
      var w = (vv && vv.width) || window.innerWidth
      app.globals.windowHeight = h
      app.globals.windowWidth = w
      self.checkBreakpoints()
    }

    app.listeners.add(window, 'orientationchange', updateViewport)
    app.listeners.add(window, 'resize', updateViewport)

    // visualViewport is best on mobile
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport)
      window.visualViewport.addEventListener('scroll', updateViewport)
    }
  },

  // define breakpoint ranges
  breakpoints: {
    xs: [0, 399],
    sm: [400, 575],
    md: [576, 767],
    lg: [768, 991],
    xl: [992, 1399],
    xxl: [1400, 1599],
    xxxl: [1600, 9999]
  },

  // ordered list of breakpoints (for fallback search)
  bpOrder: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'],

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
      app.log.info()('Current breakpoint:', bp, 'Window width:', w)
      this.applyForBreakpoint(bp)
    }
  },

  // finds closest available attribute for each element (fallback logic)
  applyForBreakpoint: function (bp) {
    var selector = ''
    for (var i = 0; i < this.bpOrder.length; i++) {
      selector += (i > 0 ? ',' : '') + '[' + this.module + '-' + this.bpOrder[i] + ']'
    }

    var elements = app.element.select(selector, true)
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
  xxl: function (element) { this._initRun('xxl', element) },
  xxxl: function (element) { this._initRun('xxxl', element) }
}