'use strict'

app.module.keyboard = {
  /**
   * @function _autoload
   * @memberof app.module.keyboard
   * @param {object} options - The script element to load the configuration for.
   * @private
   */
  keys: [],

  __autoload: function (options) {
    this.module = options.name
    var self = this

    app.listeners.add(document, 'keyup', function (e) {
      self._keypressed(e)
    })
  },

  _keypressed: function (e) {
    var currentScope = document.activeElement === document.body ? 'body' : false

    for (var current in this.keys) {
      if (e.key === current) {
        var current = this.keys[current],
          action = current.action,
          element = current.element,
          scope = current.scope,
          targetScope = scope === '' ? 'body' : scope

        if (currentScope !== targetScope) continue

        switch (action) {
          case 'click':
            app.click(element)
            break
          case 'dblclick':
            app.click(element, true)
            break
          default:
            var action = action.split(':')
            element.clicked = element
            element.callAttribute = action[0]
            app.call(action[0], [element, action[1]])
        }
      }
    }
  },

  /**
   * @function key
   * @memberof app.module.keyboard
   * @param {HTMLElement} element - The element with keyboard attributes to add.
   * @desc Adds a new keyboard action to the keys array.
   */
  key: function (element) {
    var key = element.getAttribute('keyboard-key').split(';'),
      action = element.getAttribute('keyboard-action'),
      scope = element.getAttribute('keyboard-scope')

    for (var i = 0; i < key.length; i++) {
      this.keys[key[i]] = { action: action, scope: scope, element: element }
    }
  },
}