'use strict'

app.module.screen = {
  __autoload: function (options) {
    this.module = options.name
    var self = this

    app.globals.windowHeight = window.innerHeight
    app.globals.windowWidth = window.innerWidth
    this.currentBp = null

    this._updateCurrentBp()

    // Function to run directly on events without debounce
    var handleUpdate = function () {
      var vv = window.visualViewport || null
      app.globals.windowHeight = (vv && vv.height) || window.innerHeight
      app.globals.windowWidth = (vv && vv.width) || window.innerWidth
      self._checkBreakpoints()
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleUpdate)
      window.visualViewport.addEventListener('scroll', handleUpdate)
    } else {
      app.listeners.add(window, 'resize', handleUpdate)
      app.listeners.add(window, 'orientationchange', handleUpdate)
    }
  },

  _breakpoints: {
    xxs: [0, 319],
    xs: [320, 399],
    sm: [400, 575],
    md: [576, 767],
    lg: [768, 991],
    xl: [992, 1399],
    xxl: [1400, 1599],
    xxxl: [1600, 1919],
    wide: [1920, 2559],
    ultra: [2560, 3439],
    cinema: [3440, 3999],
    mega: [4000, 9999]
  },

  _bpOrder: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'wide', 'ultra', 'cinema', 'mega'],

  _getBpByWidth: function (w) {
    var keys = this._bpOrder
    for (var i = 0; i < keys.length; i++) {
      var range = this._breakpoints[keys[i]]
      if (w >= range[0] && w <= range[1]) return keys[i]
    }
    return null
  },

  _updateCurrentBp: function () {
    this.currentBp = this._getBpByWidth(app.globals.windowWidth)
  },

  _checkBreakpoints: function () {
    var w = app.globals.windowWidth,
      bp = this._getBpByWidth(w)

    if (bp && bp !== this.currentBp) {
      this.currentBp = bp
      this._applyForBreakpoint(bp)
    }
  },

  _applyForBreakpoint: function (bp) {
    var prefix = this.module + '-',
      selector = '[' + prefix + this._bpOrder.join('],[' + prefix) + ']',
      elements = app.element.select(selector, true)

    for (var i = 0; i < elements.length; i++) {
      this._runElementLogic(elements[i], bp)
    }
  },

  // Centralized logic for evaluating an element
  _runElementLogic: function (el, bp) {
    var action = this._findClosestAttr(el, bp)
    if (action) app.call(action, { element: el })
  },

  _findClosestAttr: function (el, bp) {
    var idx = this._bpOrder.indexOf(bp)
    for (var i = idx; i >= 0; i--) {
      var attrName = this.module + '-' + this._bpOrder[i],
        value = el.getAttribute(attrName)
      if (value) return value
    }
    return null
  },

  // Shared entry point for all attribute triggers
  _initRun: function (triggerBp, element) {
    if (!this.currentBp) this._updateCurrentBp()

    var winningValue = this._findClosestAttr(element, this.currentBp),
      triggerValue = element.getAttribute(this.module + '-' + triggerBp)

    // Only run if the attribute being initialized is the one that SHOULD be active
    if (winningValue && winningValue === triggerValue) {
      this._runElementLogic(element, this.currentBp)
    }
  },

  _layouts: {
    ultimate: {
      display: 'grid',
      gridTemplateAreas: '"head head head" "nav nav nav" "left middle right" "foot foot foot"',
      gridTemplateRows: 'auto auto 1fr auto',
      gridTemplateColumns: 'auto 1fr auto',
      height: '100%',
      _children: {
        header: { gridArea: 'head', zIndex: '10' },
        nav: { gridArea: 'nav', zIndex: '10' },
        'aside:first-of-type': { gridArea: 'left', overflow: 'auto', padding: '0' },
        'aside:last-of-type': { gridArea: 'right', overflow: 'auto' },
        main: { gridArea: 'middle', overflow: 'auto', flexDirection: 'column' },
        footer: { gridArea: 'foot' },
        'footer div': { flexBasis: '0', flexGrow: '1' }
      }
    },
    lite: {
      display: 'grid',
      gridTemplateAreas: '"head head" "nav main" "foot foot"',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateColumns: 'auto 1fr',
      height: '100%',
      _children: {
        header: { gridArea: 'head', zIndex: '10' },
        nav: { gridArea: 'nav', overflow: 'auto', padding: '0' },
        main: { gridArea: 'main', overflow: 'auto', flexDirection: 'column' },
        footer: { gridArea: 'foot' },
        'footer div': { flexBasis: '0', flexGrow: '1' }
      }
    },
    centered: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '100vh'
    },
    stack: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%'
    },
    fullscreen: {
      display: 'flex',
      width: '100%',
      height: '100vh'
    },
    masonry: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem'
    },
    '2column': {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      height: '100%',
      width: '100%'
    },
    '2row': {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      height: '100%',
      width: '100%'
    },
    '3column': {
      display: 'grid',
      gridTemplateAreas: '"head" "main" "foot"',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateColumns: '1fr',
      height: '100%',
      _children: {
        header: { gridArea: 'head', zIndex: '10' },
        main: { gridArea: 'main', overflow: 'auto', flexDirection: 'column' },
        footer: { gridArea: 'foot' }
      }
    }
  },

  _applyStyles: function (el, selector, styles) {
    var elements = el.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
      for (var prop in styles) {
        if (styles.hasOwnProperty(prop)) elements[i].style[prop] = styles[prop]
      }
    }
  },

  layout: function (args) {
    var resolved = app.element.resolveCall(args)
    var el = resolved.element || resolved
    var layoutType = resolved.call ? resolved.call.value : el.getAttribute('screen-layout')
    var layoutDef = this._layouts[layoutType]

    if (!layoutDef) return

    for (var prop in layoutDef) {
      if (prop !== '_children' && layoutDef.hasOwnProperty(prop)) el.style[prop] = layoutDef[prop]
    }

    el.setAttribute('data-layout', layoutType)

    if (layoutDef._children) {
      for (var selector in layoutDef._children) {
        if (layoutDef._children.hasOwnProperty(selector)) {
          this._applyStyles(el, selector, layoutDef._children[selector])
        }
      }
    }
  },

  xxs: function (el) { this._initRun('xxs', el) },
  xs: function (el) { this._initRun('xs', el) },
  sm: function (el) { this._initRun('sm', el) },
  md: function (el) { this._initRun('md', el) },
  lg: function (el) { this._initRun('lg', el) },
  xl: function (el) { this._initRun('xl', el) },
  xxl: function (el) { this._initRun('xxl', el) },
  xxxl: function (el) { this._initRun('xxxl', el) },
  wide: function (el) { this._initRun('wide', el) },
  ultra: function (el) { this._initRun('ultra', el) },
  cinema: function (el) { this._initRun('cinema', el) },
  mega: function (el) { this._initRun('mega', el) }
}