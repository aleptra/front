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

    // run initial check
    self.checkBreakpoints()

    // re-check on resize
    app.listeners.add(window, 'resize', function () {
      app.globals.windowHeight = window.innerHeight
      app.globals.windowWidth = window.innerWidth
      self.checkBreakpoints()
    })
  },

  // define breakpoint ranges
  breakpoints: {
    sm: [0, 575],
    md: [576, 767],
    lg: [768, 991],
    xl: [992, 1199],
    xxl: [1200, Infinity]
  },

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

      // query all elements that have this breakpoint attribute
      var selector = '[' + this.module + '-' + bp + ']'
      var elements = dom.get(selector, true)
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i]
        var action = el.getAttribute(this.module + '-' + bp)
        if (action) {
          app.call(action, { element: el })
        }
      }
    }
  }
}