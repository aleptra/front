'use strict'

app.module.keyboard = {
  keys: [],
  words: [],
  buffer: '',
  _wordPendingAction: null,

  __autoload: function (options) {
    this.module = options.name
    var self = this

    app.listeners.add(document, 'keyup', function (e) {
      self._keyup(e)
    })

    app.listeners.add(document, 'keydown', function (e) {
      self._keydown(e)
    })
  },

  // Registration for Single Keys
  key: function (element) {
    var keyAttr = element.getAttribute('keyboard-key')
    if (!keyAttr) return

    var keys = keyAttr.split(','),
      action = element.getAttribute('keyboard-action'),
      scope = element.getAttribute('keyboard-scope')

    dom.setUniqueId(element, true)

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i].trim()
      var exists = false
      for (var j = 0; j < this.keys.length; j++) {
        if (this.keys[j].element === element && this.keys[j].key === k) {
          exists = true
          break
        }
      }
      if (!exists) {
        this.keys.push({ key: k, action: action, scope: scope, element: element })
      }
    }
  },

  // Registration for Word Sequences
  word: function (element) {
    var word = element.getAttribute('keyboard-word'),
      action = element.getAttribute('keyboard-action'),
      scope = element.getAttribute('keyboard-scope'),
      finalizer = element.getAttribute('keyboard-finalizer')

    dom.setUniqueId(element, true)

    var exists = false
    for (var i = 0; i < this.words.length; i++) {
      if (this.words[i].element === element && this.words[i].word === word.toLowerCase()) {
        exists = true
        break
      }
    }

    if (!exists) {
      this.words.push({
        word: word.toLowerCase(),
        action: action,
        scope: scope,
        element: element,
        finalizer: finalizer
      })
    }
  },

  _keyup: function (e) {
    var active = document.activeElement
    var isBodyFocused = active === document.body || active === document.documentElement
    var currentKey = e.key

    // 1. Check Pending Finalizers
    if (this._wordPendingAction) {
      if (currentKey === this._wordPendingAction.finalizer) {
        if (this._execute(this._wordPendingAction, e, isBodyFocused)) {
          this.buffer = ''
          this._wordPendingAction = null
          return
        }
      } else if (currentKey.length === 1 || currentKey === 'Backspace') {
        this._wordPendingAction = null
      }
    }

    // 2. Buffer Update
    if (currentKey.length === 1) {
      this.buffer += currentKey.toLowerCase()
      if (this.buffer.length > 50) {
        this.buffer = this.buffer.slice(-50)
      }
    }

    // 3. Single Key Match
    for (var i = this.keys.length - 1; i >= 0; i--) {
      var item = this.keys[i]
      if (currentKey === item.key) {
        if (this._execute(item, e, isBodyFocused)) return
      }
    }

    // 4. Word Sequence Match
    for (var j = 0; j < this.words.length; j++) {
      var wordItem = this.words[j]
      var bufferEnd = this.buffer.substring(this.buffer.length - wordItem.word.length)
      if (bufferEnd === wordItem.word) {
        if (wordItem.finalizer) {
          this._wordPendingAction = wordItem
          this.buffer = ''
        } else {
          if (this._execute(wordItem, e, isBodyFocused)) {
            this.buffer = ''
            return
          }
        }
      }
    }
  },

  _execute: function (item, e, isBodyFocused) {
    var element = item.element
    var scope = item.scope

    // ECMA5 way to check if element is in document
    if (!document.body.contains(element)) return false

    /**
     * SCOPE LOGIC
     */
    if (scope === 'body') {
      if (!isBodyFocused) return false
    } else if (scope === '') {
      if (e.target !== element) return false
    } else if (scope !== null) {
      if (e.target.getAttribute('uniqueid') !== scope) return false
    }

    switch (item.action) {
      case 'click':
        app.click(element)
        break
      case 'dblclick':
        app.click(element, true)
        break
      default:
        app.call(item.action, { element: element })
    }

    return true
  },

  _keydown: function (e) {
    this._keytranslated(e)
    this._keyuntranslated(e)
  },

  _keytranslated: function (e) {
    var translate = e.target.getAttribute('keyboard-translate')
    if (!translate) return
    var value = translate.split(':')
    if (e.key === value[0]) {
      e.preventDefault()
      var sel = window.getSelection(),
        range = sel.getRangeAt(0),
        node = document.createTextNode(value[1])
      range.deleteContents()
      range.insertNode(node)
      range.setStartAfter(node)
      range.setEndAfter(node)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  },

  _keyuntranslated: function (e) {
    var untranslate = e.target.getAttribute('keyboard-untranslate')
    if (!untranslate) return
    var parts = untranslate.split(':')
    if (e.key !== parts[0]) return

    var val = parts[1],
      sel = window.getSelection(),
      range = sel.getRangeAt(0),
      node = range.startContainer,
      offset = range.startOffset,
      text = node.textContent

    if (offset >= val.length && text.substring(offset - val.length, offset) === val) {
      node.textContent = text.substring(0, offset - val.length) + text.substring(offset)
      var newRange = document.createRange()
      newRange.setStart(node, offset - val.length)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
      e.preventDefault()
    }
  }
}