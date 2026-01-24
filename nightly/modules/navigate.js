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

    // Cache main container once
    this.mainTarget = app.element.select(this.config.target)

    if (history.pushState) {
      app.listeners.add(window, 'popstate', this._pop.bind(this))
      app.listeners.add(document, 'click', this._click.bind(this))
    }

    // iOS Safari BFCache fix
    app.listeners.add(window, 'pageshow', function (e) {
      alert('test')
      if (e.persisted) {

        alert('persisted')
        // 1. IMPORTANT: Remove the "blocking" listener from front.js
        app.disable(false)

        // 2. Refresh attributes for your target container
        if (app.attributes && app.attributes.run) {
          app.attributes.run(this.config.target + ' *')
        }

        // 3. Clear the preloader if it got stuck in the cache
        if (this._preloader && this._preloader.finish) {
          this._preloader.finish()
        }
      }
    }.bind(this))

    app.listeners.add(window, 'hashchange', this._hash.bind(this))
    if (this.mainTarget) app.listeners.add(this.mainTarget, 'scroll', this._saveScroll.bind(this))
    // Restore scroll position immediately after load
    this._restoreScroll()
  },

  /**
   * Saves current scroll position to session storage before reload or navigation away.
   */
  _saveScroll: function () {
    var scrollTop = this.mainTarget.scrollTop || 0,
      key = '_' + window.location.pathname

    app.caches.set('window', 'module', 'navigate' + key, '{ "top": ' + scrollTop + ' }')
  },

  /**
   * Restores scroll position when page is reloaded or navigated back,
   * waiting until the content is fully rendered or timeout reached.
   */
  _restoreScroll: function () {
    var self = this,
      key = '_' + window.location.pathname,
      saved = app.caches.get('window', 'module', 'navigate' + key, { fetchJson: true })
    if (!saved) return

    var mainTarget = self.mainTarget,
      lastHeight = 0,
      stable = 0,
      waited = 0,
      step = 200,
      limit = 15000

      ; (function check() {
        var h = mainTarget.scrollHeight
        stable = (h === lastHeight) ? stable + 1 : 0
        lastHeight = h

        if (stable >= 3 || waited >= limit) {
          dom.scroll(self.config.target, parseInt(saved.top, 10))
        } else {
          waited += step
          setTimeout(check, step)
        }
      })()
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
        link.pathname = href.value
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
            'href': link.href,
            'pathname': link.pathname,
            'target': target,
            'arg': { disableSrcdoc: true, runAttributes: true }
          }

          // Prevent duplicate history entries.
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
      'href': window.location.href,
      'pathname': window.location.pathname,
      'hash': window.location.hash,
      'target': !event.state ? this.config.target : 'html',
      'extension': false,
      'arg': { disableSrcdoc: true, runAttributes: true }
    }
    this._load(state)
    if (state.hash) this._hash(state)

    // Restore scroll position immediately after load
    this._restoreScroll()
  },

  /**
   * @function _load
   * @memberof app.module.navigate
   * @private
   */
  _load: function (state) {
    var regex = /^\/+|\/+$/g,
      startpage = app.isLocalNetwork ? this.config.startpageLocal : this.config.startpage || '/'

    if (startpage && (state.pathname === '/' || state.pathname.replace(regex, '') === startpage.replace(regex, ''))) {
      app.disable(true)
      app.isFrontpage = true
      state.target = 'html'
      state.extension = false
    }

    app.xhr.request({
      url: state.pathname,
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
      var targetElement = app.element.select(hash)
      if (targetElement) this._scroll('smooth', targetElement.offsetTop)
    }
  },

  _scroll: function (behavior, top) {
    var target = app.element.select('main') || app.element.select('html')

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
      this.element = app.element.select(selector)
      this.elementChild = this.element.firstElementChild
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
      app.disable(false)
      cancelAnimationFrame(this.intervalId)
      clearInterval(this.intervalId)
      dom.hide(this.element)
    },
  },
}