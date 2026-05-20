'use strict'

app.plugin.readingtime = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.globalConfig = {
      wpm: 200,
      lessThanMsg: '< 1 min read',
      minuteMsg: 'min read',
      minutesMsg: 'min to read'
    }
  },
  set: function (object) {
    var el = object && object.exec ? object.exec.element : object
    if (!el || !el.nodeType) return

    var activeConfig = app.config.get(this.plugin, this.globalConfig, el)
    var targetSelector = el.getAttribute('readingtime--set')

    if (!targetSelector) {
      var attrs = el.attributes
      for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].name.indexOf('readingtime--set:') === 0) {
          targetSelector = attrs[i].name.substring(17)
          break
        }
      }
    }

    if (!targetSelector) return

    var targetEl = document.querySelector(targetSelector)
    if (!targetEl) return

    var text = targetEl.innerText || targetEl.textContent || ''
    var words = text.trim().split(/\s+/)
    var totalWords = words[0] === '' ? 0 : words.length
    var wpm = parseInt(activeConfig.wpm, 10) || 200
    var minutes = Math.round(totalWords / wpm)
    var outputText = ''

    if (minutes < 1) {
      outputText = activeConfig.lessThanMsg
    } else if (minutes === 1) {
      outputText = '1 ' + activeConfig.minuteMsg
    } else {
      outputText = minutes + ' ' + activeConfig.minutesMsg
    }

    el.innerHTML = outputText
  }
}