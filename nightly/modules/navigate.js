'use strict'

app.module.navigate = {

  /**
   * @function _autoload
   * @memberof app.module.navigate
   * @param {object} options - The script element to load the configuration for.
   * @private
   */
  __autoload: function (options) {
    app.spa = this // Enable Single Page Application support using this module.

    this.config = app.config.get('navigate', {
      target: 'main',
      preloader: '#navloader',
      startpage: false,
      startpageLocal: false,
    }, options.element)

    if (history.pushState) {
      app.listeners.add(window, 'popstate', this._pop.bind(this))
      app.listeners.add(document, 'click', this._click.bind(this))
    }

    app.listeners.add(window, 'hashchange', this._hash.bind())
  },

  go: function (event) {
    event.target = event.exec.element
    this._click(event)
  },

  /**
   * @function _click
   * @memberof app.module.navigate
   * @private
   */
  _click: function (event) {
    var link = app.element.getTagLink(event.target),
      href = link && link.attributes.href

    if (link && href) {
      // Support href in all elements.
      if (link.localName !== 'a') {
        link.href = href.value
        link.pathname = link.baseURI + href.value
      }

      if (link.hash) {
        this._hash(link)
      } else if (link.href) {
        if (link.target === '_blank') {
          return
        } else {
          var pushState = link.getAttribute('navigate-pushstate') === 'false' ? false : true,
            target = link.target === '_top' ? 'html' : link.target || this.config.target

          var state = {
            'href': link.pathname,
            'target': target,
            'arg': { disableSrcdoc: true, runAttributes: true }
          }

          if (link.href !== window.location.href && pushState) history.pushState(state, '', link.href)

          this._scroll() // Reset scroll to top.
          this._load(state) // Load page.
        }
      }
      return event.preventDefault()
    }
  },

  /**
   * @function _pop
   * @memberof app.module.navigate
   * @private
   */
  _pop: function (event) {
    var state = (event.state) ? event.state : {
      'href': window.location.pathname,
      'hash': window.location.hash,
      'target': !event.state ? this.config.target : 'html',
      'extension': false,
      'arg': { disableSrcdoc: true, runAttributes: true }
    }
    this._load(state)
    if (state.hash) this._hash(state)
  },

  /**
   * @function _load
   * @memberof app.module.navigate
   * @private
   */
  _load: function (state) {
    var regex = /^\/+|\/+$/g,
      startpage = app.isLocalNetwork ? this.config.startpageLocal : this.config.startpage || '/'

    if (startpage && (state.href === '/' || state.href.replace(regex, '') === startpage.replace(regex, ''))) {
      app.isFrontpage = true
      state.target = 'html'
      state.extension = false
      app.disable(true)
    }

    app.xhr.request({
      url: state.href,
      urlExtension: state.extension,
      target: state.target,
      single: true,
      type: 'page',
      onprogress: { preloader: this.config.preloader },
      onload: {
        run: {
          func: 'app.attributes.run',
          arg: state.target + ' *'
        }
      }
    })

    this._preloader.set(this.config.preloader)
    this._preloader.reset()
  },

  _hash: function (link) {
    var hash = link && link.hash
    if (hash) {
      var targetElement = dom.get(hash)
      if (targetElement) this._scroll('smooth', targetElement.offsetTop)
    }
  },

  _scroll: function (behavior, top) {
    var target = dom.get('main') || dom.get('html')

    if (target.scrollTo) {
      target.scrollTo({
        top: top ? top : 0,
        behavior: behavior ? behavior : 'instant'
      })
    } else {
      target.scrollTop = top ? top : 0
    }
  },

  /**
   * @function _preloader
   * @memberof app.module.navigate
   * @private
   */
  _preloader: {
    intervalId: null,
    treshold: 10000,
    increment: 5,
    element: null,
    elementChild: null,
    eventCount: 0,
    isFastPage: true,

    set: function (selector) {
      this.element = dom.get(selector)
      this.elementChild = this.element.firstChild
    },

    load: function (e, onprogress) {
      if (!this.elementChild) return
      if (onprogress) this.eventCount++
      if (this.isFastPage) this.eventCount = 0
      this.isFastPage = true

      var loaded = e.loaded || 0,
        total = e.total || (e.target.getResponseHeader('Content-Length') || e.target.getResponseHeader('content-length')) || 0,
        percent = Math.round((loaded / total) * 100) || 0

      if (loaded !== total && total >= this.treshold) { // Slow page
        this.isFastPage = false
        if (percent <= 100 && this.eventCount > 0) this.progress(percent)
      } else { // Fast page
        if (this.isFastPage && this.eventCount < 3)
          this.intervalId = requestAnimationFrame(this.animate.bind(this))
        else
          this.progress(100)
      }
    },

    animate: function () {
      var self = this,
        width = 0

      function animateFrame() {
        width += self.increment
        self.progress(width)
        if (width <= 100)
          requestAnimationFrame(animateFrame)
      }

      requestAnimationFrame(animateFrame)
    },

    progress: function (width) {
      this.elementChild.style.width = width + '%'
      if (width >= 100) this.finish()
    },

    reset: function () {
      if (!this.element) return
      this.progress(0)
      cancelAnimationFrame(this.intervalId)
      clearInterval(this.intervalId)
      dom.show(this.element)
    },

    finish: function () {
      cancelAnimationFrame(this.intervalId)
      clearInterval(this.intervalId)
      dom.hide(this.element)
      app.disable(false)
    },
  },
}