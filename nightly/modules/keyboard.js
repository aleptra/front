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
    var isBodyScope = document.activeElement === document.body ? 'body' : false

    for (var i = 0; i < this.keys.length; i++) {
      var current = this.keys[i]
      if (e.key === current.key) {
        var action = current.action,
          element = current.element,
          targetUid = e.target.uniqueId,
          scope = current.scope === '' ? element.uniqueId : current.scope

        if (scope === isBodyScope) scope = false        
        if (scope && targetUid !== scope) continue

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

  key: function (element) {
    var key = element.getAttribute('keyboard-key'),
      action = element.getAttribute('keyboard-action'),
      scope = element.getAttribute('keyboard-scope')

    dom.setUniqueId(element, true)

    this.keys.push({ key: key, action: action, scope: scope, element: element })
  },
}