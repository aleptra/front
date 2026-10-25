/**
 * @module auth
 * @description Authentication module for Front.
 * Handles JWT token validation, login/logout state,
 * and provides FTML attributes for protecting content.
 *
 * Usage:
 *   <script src="front.js" module="auth"></script>
 *
 * FTML attributes:
 *   auth-protect        - Removes element if not authenticated
 *   auth-protect="redirect:login.html" - Redirects if not authenticated
 *   auth-show           - Shows element only when authenticated
 *   auth-hide           - Hides element when authenticated (e.g. login button)
 *
 * Globals:
 *   app.globals.get('authenticated')  - Boolean
 *   app.globals.get('authUser')       - Decoded token payload
 *
 * API:
 *   app.module.auth.login(token)
 *   app.module.auth.logout()
 *   app.module.auth.isValid()
 *   app.module.auth.getHeader()
 *   app.module.auth.getUser()
 */

app.module.auth = {
  _storageKey: 'auth',
  _token: null,
  _user: null,
  _valid: false,
  _cookieDomain: null,

  /**
   * @function __autoload
   * @desc Called automatically when the module is loaded.
   */
  __autoload: function (options) {
    var conf = app.config.get('auth', {
      storageKey: 'auth',
      redirectOnExpiry: '',
      refreshMargin: 60000,
      cookieDomain: ''
    }, options.element)

    this._storageKey = conf.storageKey
    this._redirectOnExpiry = conf.redirectOnExpiry
    this._refreshMargin = parseInt(conf.refreshMargin, 10)
    this._cookieDomain = conf.cookieDomain

    this._token = this._getToken()
    this._user = this._decode()
    this._valid = this._checkValid()

    app.globals.set('authenticated', this._valid)
    app.globals.set('authUser', this._user)

    if (this._valid) {
      this._scheduleExpiry()
    } else if (this._token) {
      // Token exists but expired — clean up
      this._clear()
    }
  },

  /**
   * @function login
   * @desc Stores a token and updates auth state.
   * @param {string} token - JWT token string
   */
  login: function (arg) {
    var token = arg
    if (arg && arg.options && arg.options.response && arg.options.response.data &&
      typeof arg.options.response.data.token === 'string') {
      token = arg.options.response.data.token
    } else if (arg && arg.exec && typeof arg.exec.value === 'string') {
      token = arg.exec.value
    }

    this._token = token
    this._setToken(token)
    this._user = this._decode()
    this._valid = this._checkValid()
    app.globals.set('authenticated', this._valid)
    app.globals.set('authUser', this._user)

    if (this._valid) {
      this._scheduleExpiry()
      app.listeners.dispatch('auth:login', { user: this._user })
    }
  },

  /**
   * @function logout
   * @desc Clears token and resets auth state.
   */
  logout: function () {
    this._clear()
    app.listeners.dispatch('auth:logout')
  },

  /**
   * @function isValid
   * @desc Returns whether the current token is valid and not expired.
   * @returns {boolean}
   */
  isValid: function () {
    return this._valid
  },

  /**
   * @function getUser
   * @desc Returns the decoded token payload.
   * @returns {object|null}
   */
  getUser: function () {
    return this._user
  },

  /**
   * @function getHeader
   * @desc Returns the Authorization header value for API requests.
   * @returns {string}
   */
  getHeader: function () {
    return this._valid && this._token ? 'Bearer ' + this._token : ''
  },

  /**
   * @function getToken
   * @desc Returns the raw token string.
   * @returns {string|null}
   */
  getToken: function () {
    return this._valid ? this._token : null
  },

  /**
   * @function getClaim
   * @desc Returns a specific claim from the token payload.
   * @param {string} key - Claim name (e.g. 'sub', 'email', 'role')
   * @returns {*}
   */
  getClaim: function (key) {
    return this._user ? this._user[key] : null
  },

  // --- FTML attribute handlers ---

  /**
   * @function protect
   * @desc FTML: <div auth-protect> or <div auth-protect="redirect:url">
   * If not authenticated: removes element by default, or redirects if redirect:url is specified.
   */
  protect: function (element, value) {
    if (!this._valid) {
      var protect = element.exec ? element.exec.string : (element.getAttribute && element.getAttribute('auth-protect'))
      if (protect && protect.indexOf(':') > -1) {
        // Handle redirect case: auth-protect="redirect:url"
        var parts = protect.split(':')
        var url = parts[1] ? parts.slice(1).join(':') : ''
        url && (window.location.href = url)
      } else {
        // No value or empty: remove the element
        element.parentNode && element.parentNode.removeChild(element)
      }
    }
  },

  /**
   * @function show
   * @desc FTML: <div auth-show> — only visible when authenticated.
   */
  show: function (element) {
    if (!this._valid) {
      dom.hide(element)
    }
  },

  /**
   * @function hide
   * @desc FTML: <div auth-hide> — hidden when authenticated (e.g. login link).
   */
  hide: function (element) {
    if (this._valid) {
      dom.hide(element)
    }
  },

  // --- Internal ---

  _getToken: function () {
    if (this._cookieDomain) {
      var cookieToken = this._getCookie(this._storageKey)
      if (cookieToken) return cookieToken
    }
    return localStorage.getItem(this._storageKey)
  },

  _setToken: function (token) {
    localStorage.setItem(this._storageKey, token)
    if (this._cookieDomain) {
      this._setCookie(this._storageKey, token)
    }
  },

  _removeToken: function () {
    localStorage.removeItem(this._storageKey)
    if (this._cookieDomain) {
      this._deleteCookie(this._storageKey)
    }
  },

  _setCookie: function (name, value) {
    var expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/;domain=' + this._cookieDomain
  },

  _getCookie: function (name) {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      if (cookie.indexOf(name + '=') === 0) {
        return decodeURIComponent(cookie.substring(name.length + 1))
      }
    }
    return null
  },

  _deleteCookie: function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=' + this._cookieDomain
  },

  _decode: function () {
    if (!this._token) return null
    try {
      var parts = this._token.split('.')
      if (parts.length !== 3) return null
      return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    } catch (e) {
      return null
    }
  },

  _checkValid: function () {
    if (!this._user || !this._user.exp) return false
    return this._user.exp * 1000 > Date.now()
  },

  _clear: function () {
    this._removeToken()
    this._token = null
    this._user = null
    this._valid = false
    app.globals.set('authenticated', false)
    app.globals.set('authUser', null)
  },

  _scheduleExpiry: function () {
    if (!this._user || !this._user.exp) return
    var self = this
    var remaining = (this._user.exp * 1000) - Date.now()

    if (remaining <= 0) {
      this._onExpiry()
      return
    }

    if (this._expiryTimer) clearTimeout(this._expiryTimer)

    this._expiryTimer = setTimeout(function () {
      self._onExpiry()
    }, remaining)
  },

  _onExpiry: function () {
    this._clear()
    app.listeners.dispatch('auth:expired')

    if (this._redirectOnExpiry) {
      window.location.href = this._redirectOnExpiry
    }
  }
}
