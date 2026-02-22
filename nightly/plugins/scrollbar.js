'use strict'

app.plugin.scrollbar = {

  // prevent injecting multiple global styles
  _globalApplied: false,

  __autoload: function (options) {
    this.plugin = options.name + '-'

    // Read declarative configuration like other Front plugins
    this.config = app.config.get(
      this.plugin,
      {
        width: 8,
        radius: 4,
        thumb: 'rgba(255,255,255,.25)',
        track: 'transparent',
        hover: 'rgba(255,255,255,.45)'
      },
      options.element
    )

    this._apply(options.element)
  },

  /**
   * Public API — allows manual execution via `scrollbar:set`
   * Example: app.call('scrollbar:set', el)
   * Re-reads configuration from the target element so dynamic
   * includes / re-renders get correct values.
   */
  set: function (object) {
    // Front may pass execution wrapper
    var el = object && object.exec ? object.exec.element : object

    // Only continue if we have a real element
    if (!el || !el.nodeType) return

    // Rebuild plugin key (same as __autoload)
    this.plugin = 'scrollbar-'

    // Re-read config from THIS element (important for dynamic DOM)
    this.config = app.config.get(
      this.plugin,
      {
        width: 8,
        radius: 4,
        thumb: 'rgba(255,255,255,.25)',
        track: 'transparent',
        hover: 'rgba(255,255,255,.45)'
      },
      el
    )

    this._apply(el)
  },

  /**
   * Decide if this is a GLOBAL scrollbar (body/html)
   * or a scoped scrollbar (component-level)
   */
  _isGlobal: function (el) {
    return el === document.body || el === document.documentElement
  },

  _apply: function (el) {
    if (this._isGlobal(el)) {
      if (this._globalApplied) return
      this._globalApplied = true
      this._inject(this._buildStyles(':root'))
      return
    }

    // Scoped scrollbar
    var id = 'sb-' + Math.random().toString(36).slice(2)
    el.setAttribute('data-scrollbar', id)

    this._inject(this._buildStyles('[data-scrollbar="' + id + '"]'))
  },

  /**
   * Build CSS dynamically from config
   * scope can be :root (global) or [data-scrollbar="id"] (local)
   */
  _buildStyles: function (scope) {
    var c = this.config

    return `
      ${scope} {
        scrollbar-width: thin;
        scrollbar-color: ${c.thumb} ${c.track};
      }

      ${scope}::-webkit-scrollbar {
        width: ${c.width}px;
        height: ${c.width}px;
      }

      ${scope}::-webkit-scrollbar-track {
        background: ${c.track};
      }

      ${scope}::-webkit-scrollbar-thumb {
        background: ${c.thumb};
        border-radius: ${c.radius}px;
      }

      ${scope}::-webkit-scrollbar-thumb:hover {
        background: ${c.hover};
      }
    `
  },

  _inject: function (css) {
    if (!css) return

    var style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
  }
}