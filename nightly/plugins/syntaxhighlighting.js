'use strict'

app.plugin.syntaxhighlighting = {

  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      {
        colors: 'slategray,silver,cornsilk,navajowhite,green',
        javascriptColors: 'cornflowerblue,burlywood,green,mediumpurple,gray',
        shellColors: 'slategray,silver,cornsilk,navajowhite,green',
        errorColor: 'red',
      },
      options.element
    )
    this.markupElement = "display: inline; background: none; color:"
  },

  set: function (object) {
    if (object.exec) object = object.exec.element
    var self = this
    var language = this._detectLanguage(object.innerHTML)

    if (language === 'html') {
      object.innerHTML = this._colorizeHtml(object.innerHTML, this.config.colors)
    } else if (language === 'shell') {
      object.innerHTML = this._colorizeShell(object.innerHTML, this.config.shellColors || this.config.colors)
    } else if (language === 'javascript') {
      object.innerHTML = this._colorizeJavaScript(object.innerHTML, this.config.javascriptColors || this.config.colors)
    }

    if (object.isContentEditable && !object._syntaxBound) {
      object._syntaxBound = true
      var timer = null
      object.addEventListener('input', function () {
        clearTimeout(timer)
        timer = setTimeout(function () {
          var sel = window.getSelection()
          var range = sel.rangeCount ? sel.getRangeAt(0) : null
          var textBefore = ''
          if (range) {
            var preRange = document.createRange()
            preRange.selectNodeContents(object)
            preRange.setEnd(range.startContainer, range.startOffset)
            textBefore = preRange.toString()
          }

          var before = object.textContent
          var escaped = before.replace(/&/g, '\x26amp;').replace(/</g, '\x26lt;').replace(/>/g, '\x26gt;')
          var lang = self._detectLanguage(escaped)
          var colorized = escaped

          if (lang === 'html') {
            colorized = self._colorizeHtml(escaped, self.config.colors)
          } else if (lang === 'javascript') {
            colorized = self._colorizeJavaScript(escaped, self.config.javascriptColors || self.config.colors)
          } else if (lang === 'shell') {
            colorized = self._colorizeShell(escaped, self.config.shellColors || self.config.colors)
          }

          object.innerHTML = colorized

          // Validate and highlight errors
          self._validate(object, escaped, before, lang)

          // Restore cursor
          var walker = document.createTreeWalker(object, NodeFilter.SHOW_TEXT)
          var charCount = 0, node
          while (node = walker.nextNode()) {
            var next = charCount + node.textContent.length
            if (next >= textBefore.length) {
              var r = document.createRange()
              r.setStart(node, textBefore.length - charCount)
              r.collapse(true)
              sel.removeAllRanges()
              sel.addRange(r)
              return
            }
            charCount = next
          }
        }, 500)
      })
    }
  },

  _validate: function (object, escaped, before, language) {
    var errorLines = {}
    var rawLines = escaped.split('\n')

    for (var i = 0; i < rawLines.length; i++) {
      var line = rawLines[i]

      // Common: unclosed quotes
      var dq = (line.match(/"/g) || []).length
      var sq = (line.match(/'/g) || []).length
      if (dq % 2 !== 0 || sq % 2 !== 0) errorLines[i] = true

      if (language === 'html') {
        // Invalid opening tag name (e.g. <div#>)
        if (/&lt;[a-zA-Z]+[#!@$%^*~]+/.test(line)) errorLines[i] = true
        // Invalid closing tag (e.g. </div#>)
        if (/&lt;\/\w*[#!@$%^*~]+/.test(line)) errorLines[i] = true
      }

      if (language === 'javascript') {
        // Unclosed brackets on a single line
        var open = (line.match(/\(/g) || []).length
        var close = (line.match(/\)/g) || []).length
        if (open !== close) errorLines[i] = true
      }
    }

    // If browser mangled it, fallback to escaped
    if (object.textContent !== before) {
      object.innerHTML = escaped
      errorLines = {}
      for (var i = 0; i < rawLines.length; i++) {
        var dq = (rawLines[i].match(/"/g) || []).length
        var sq = (rawLines[i].match(/'/g) || []).length
        if (dq % 2 !== 0 || sq % 2 !== 0) errorLines[i] = true
      }
    }

    // Apply error highlighting
    var hasErrors = false
    for (var k in errorLines) { hasErrors = true; break }
    if (hasErrors) {
      var outLines = object.innerHTML.split('\n')
      for (var i in errorLines) {
        if (outLines[i] !== undefined) {
          console.error('Syntax error on line ' + (parseInt(i) + 1) + ':', rawLines[i])
          outLines[i] = '<mark style="display:inline;background:' + this.config.errorColor + '">' + outLines[i] + '</mark>'
        }
      }
      object.innerHTML = outLines.join('\n')
    }
  },

  _detectLanguage: function (text) {
    text = text.trim()

    // Shell scripts
    if (/^#!(\w+)\/(\w+)/g.test(text)) return 'shell'
    // JavaScript
    if (/\bfunction\s*(\w*\s*)\(/.test(text)) return 'javascript'
    // HTML
    if (/^\x26lt;!DOCTYPE html\x26gt;|^\x26lt;html\x26gt;/.test(text) || /\x26lt;[a-z]+\b/.test(text)) return 'html'

    // Default fallback
    return 'html'
  },

  _colorizeHtml: function (text, colors) {
    var color = colors.split(','),
      style = this.markupElement

    // Tags and self-closing tags.
    var rep = text.replace(/(\x26lt;\/?)(\w+)((?:"[^"]*"|'[^']*'|(?!\x26gt;)[\s\S])*?)(\/?)(\x26gt;)/g, function (match, p1, tag, attributes, selfClosing) {
      var closed = '',
        selfClosingTag = '',
        colorTag = color[1],
        colorSlash = color[0]

      if (p1 === '\x26lt;/') {
        attributes = ''
        closed = '/'
      }

      if (selfClosing) {
        selfClosingTag = '<mark style="' + style + colorSlash + '">/</mark>';
      }

      if (attributes) {
        attributes = attributes.replace(/([\w:-]+)(=(["'][^"']*["']|[^\s>]+))?/g, function (attrMatch, attrName, attrValue) {
          var equal = ''
          if (attrValue) {
            if (attrValue[0] === '=') {
              attrValue = attrValue.slice(1)
              equal = '='
            }
            return '<mark style="' + style + color[2] + '">' + attrName + '</mark>' + equal + '<mark style="' + style + color[3] + '">' + attrValue + '</mark>'
          } else {
            return '<mark style="' + style + color[2] + '">' + attrName + '</mark>'
          }
        })
      }

      return '<mark style="' + style + colorSlash + '">\x26lt;' + closed + '</mark><mark style="' + style + colorTag + '">' + tag + '</mark>' + attributes + selfClosingTag + '<mark style="' + style + colorSlash + '">\x26gt;</mark>'
    })

    // Comments.
    rep = rep.replace(/(\x26lt;!--[\s\S]*?--\x26gt;)/g, function (match, comment) {
      return '<mark style="' + style + color[4] + '">' + comment + '</mark>'
    })

    return rep
  },

  _colorizeShell: function (text, colors) {
    var color = colors.split(','),
      style = this.markupElement

    var rep = text.replace(/^#!(\w+)\/(\w+)/g, function (match) {
      return '<mark style="' + style + color[0] + '">' + match + '</mark>'
    })

    return rep
  },

  _colorizeJavaScript: function (text, colors) {
    var color = colors.split(','),
      style = this.markupElement

    var rep = text.replace(/(["'`])(.*?)\1/g, function (match, quote, content) {
      return '<mark style="' + style + color[1] + '">' + quote + content + quote + '</mark>'
    })

    rep = rep.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, function (match) {
      return '<mark style="' + style + color[4] + '">' + match + '</mark>'
    })

    rep = rep.replace(/\b(function|var|let|const|if|else|for|while|return|true|false|null|undefined|async|await)\b/g, function (match) {
      return '<mark style="' + style + color[0] + '">' + match + '</mark>'
    })

    return rep
  }
}
