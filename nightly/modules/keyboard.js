'use strict'

app.module.keyboard = {
  keys: [],
  words: [], // Store registered words here
  buffer: '', // Tracks the history of typed keys

  // --- NEW PROPERTY ---
  _wordPendingAction: null, // Stores the item data if a word match occurs

  /**
   * @function _autoload
   * @memberof app.module.keyboard
   * @param {object} options - The script element to load the configuration for.
   * @private
   */
  __autoload: function (options) {
    this.module = options.name
    var self = this

    app.listeners.add(document, 'keyup', function (e) {
      self._keypressed(e)
    })

    app.listeners.add(document, 'keydown', function (e) {
      self._keytranslated(e)
      self._keyuntranslated(e)
    })
  },

  _keytranslated: function (e) {
    var translate = e.target.getAttribute('keyboard-translate')
    if (translate) {
      var value = translate.split(':')
      if (e.key === value[0]) {
        e.preventDefault()

        var selection = window.getSelection(),
          range = selection.getRangeAt(0),
          spaceNode = document.createTextNode(value[1])

        range.deleteContents()
        range.insertNode(spaceNode)

        range.setStartAfter(spaceNode)
        range.setEndAfter(spaceNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  },

  _keyuntranslated: function (e) {
    var untranslate = e.target.getAttribute('keyboard-untranslate')
    if (untranslate && e.key === untranslate.split(':')[0]) {

      var value = untranslate.split(':')[1],
        selection = window.getSelection(),
        range = selection.getRangeAt(0),
        startNode = range.startContainer,
        startOffset = range.startOffset,
        text = startNode.textContent

      if (startOffset >= value.length) { // Check length to be safe
        var substringBefore = text.substring(startOffset - value.length, startOffset)
        if (substringBefore === value) {

          var newText = text.substring(0, startOffset - value.length) + text.substring(startOffset)
          startNode.textContent = newText

          var newRange = document.createRange()
          newRange.setStart(startNode, startOffset - value.length)
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)

          e.preventDefault()
        }
      }
    }
  },

  _keypressed: function (e) {
    var isBodyScope = document.activeElement === document.body ? 'body' : false
    var currentKey = e.key // Capture the key being pressed

    // 1. CHECK FOR PENDING FINALIZER ACTION (e.g., 'hello' was typed, waiting for 'Enter')
    if (this._wordPendingAction) {
      if (currentKey === this._wordPendingAction.finalizer) {
        // Finalizer matched! Execute the action.
        this._execute(this._wordPendingAction, e, isBodyScope, 'Word Sequence + Finalizer')
        this.buffer = ''
        this._wordPendingAction = null // Reset the state
        return // Stop processing
      } else {
        this._wordPendingAction = null // Invalidate the previous word match
      }
    }

    // 2. Update the typing buffer (only if we didn't execute a finalizer)
    if (currentKey.length === 1) {
      this.buffer += currentKey.toLowerCase()
      if (this.buffer.length > 50) {
        this.buffer = this.buffer.slice(-50)
      }
    }

    // 3. Check Single Keys (Existing Logic - No Change)
    for (var i = 0; i < this.keys.length; i++) {
      var currentKeyItem = this.keys[i]
      if (currentKey === currentKeyItem.key) {
        this._execute(currentKeyItem, e, isBodyScope, 'Single Key')
        return
      }
    }

    // 4. Check Words (Updated Logic)
    for (var j = 0; j < this.words.length; j++) {
      var currentWord = this.words[j]

      if (this.buffer.endsWith(currentWord.word)) {
        if (currentWord.finalizer) {
          // Word matched, but requires a final key (like Enter)
          this._wordPendingAction = currentWord // Store the action and wait
          this.buffer = '' // Clear buffer to prevent re-matching
        } else {
          // Word matched, execute immediately (original behavior)
          this._execute(currentWord, e, isBodyScope, 'Word Sequence')
          this.buffer = ''
        }
        return // Optimization: stop after a word match
      }
    }
  },

  // Helper to run the action (Click/Call) so we don't duplicate code
  _execute: function (item, e, isBodyScope, type) {
    var action = item.action,
      element = item.element,
      targetUid = e.target.uniqueId,
      scope = item.scope === '' ? element.uniqueId : item.scope

    if (scope === isBodyScope) scope = false

    if (scope && targetUid !== scope) {
      return
    }

    switch (action) {
      case 'click':
        app.click(element)
        break
      case 'dblclick':
        app.click(element, true)
        break
      default:
        // Original console.log is replaced by debug check or removed if action is called
        app.call(action, { element: element })
    }
  },

  // Register a single key
  key: function (element) {
    var key = element.getAttribute('keyboard-key').split(';'),
      action = element.getAttribute('keyboard-action'),
      scope = element.getAttribute('keyboard-scope')

    dom.setUniqueId(element, true)

    for (var i = 0; i < key.length; i++) {
      this.keys.push({ key: key[i], action: action, scope: scope, element: element })
    }
  },

  // Register a word sequence
  word: function (element) {
    var word = element.getAttribute('keyboard-word'),
      action = element.getAttribute('keyboard-action'),
      scope = element.getAttribute('keyboard-scope'),
      // --- NEW LINE ---
      finalizer = element.getAttribute('keyboard-finalizer')

    dom.setUniqueId(element, true)

    this.words.push({
      word: word.toLowerCase(),
      action: action,
      scope: scope,
      element: element,
      finalizer: finalizer // Store the final key (e.g., 'Enter')
    })
  }
}