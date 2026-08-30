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

  /**
   * @function __autoload
   * @desc Called automatically when the module is loaded.
   */
  __autoload: function (options) {
    var conf = app.config.get('auth', {
      storageKey: 'auth',
      redirectOnExpiry: '',
      refreshMargin: 60000
    }, options.element)

    this._storageKey = conf.storageKey
    this._redirectOnExpiry = conf.redirectOnExpiry
    this._refreshMargin = parseInt(conf.refreshMargin, 10)

    this._token = localStorage.getItem(this._storageKey)
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
  login: function (token) {
    this._token = token
    localStorage.setItem(this._storageKey, token)
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
   */
  protect: function (element) {
    if (!this._valid) {
      var value = element.getAttribute('auth-protect')
      if (value && value.indexOf('redirect:') === 0) {
        window.location.href = value.replace('redirect:', '')
      } else {
        element.remove()
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
    localStorage.removeItem(this._storageKey)
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
