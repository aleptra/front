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
        indent: '  ',
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

    if (object.isContentEditable) {
      var escaped = object.textContent.replace(/&/g, '\x26amp;').replace(/</g, '\x26lt;').replace(/>/g, '\x26gt;')
      this._validate(object, escaped, object.textContent, language)

      if (!object._syntaxBound) {
        object._syntaxBound = true
        this.format(object)
        var timer = null

        object.addEventListener('paste', function (e) {
          e.preventDefault()
          var text = (e.clipboardData || window.clipboardData).getData('text/plain')
          document.execCommand('insertText', false, text)
          setTimeout(function () { self.format(object) }, 0)
        })

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
            if (before === object._lastText) return
            object._lastText = before
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
    }
  },

  format: function (object) {
    if (object.exec) object = object.exec.element
    var indent = this.config.indent || '  '
    var text = object.textContent
    var voidTags = /^<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)\b/

    // Split adjacent tags onto separate lines (but keep <tag></tag> pairs together)
    text = text.replace(/>(<[a-zA-Z\/])/g, function (match, p1) {
      // Don't break between opening and its immediate closing tag
      if (p1.charAt(0) === '<' && p1.charAt(1) === '/') return '>' + p1
      return '>\n' + p1
    })

    var lines = text.split('\n')
    var level = 0
    var formatted = []

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue

      // Decrease indent for closing tags
      if (/^<\//.test(line)) level--

      formatted.push(Array(Math.max(level, 0) + 1).join(indent) + line)

      // Increase indent for opening tags (not self-closing, not void, not closing, not same-line close)
      if (/^<[a-zA-Z]/.test(line) && !/\/>$/.test(line) && !voidTags.test(line) && !/^<\//.test(line)) {
        var tagMatch = line.match(/^<([a-zA-Z][a-zA-Z0-9]*)/)
        if (tagMatch && new RegExp('</' + tagMatch[1] + '>').test(line)) {
          // Tag opens and closes on same line, don't increase
        } else {
          level++
        }
      }
    }

    object.textContent = formatted.join('\n')
    this.set(object)
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
        var rawLine = object.textContent.split('\n')[i] || ''
        // Invalid closing tag (e.g. </head#>)
        if (/<\/[a-zA-Z]*[^a-zA-Z0-9>\s]+[^>]*>/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Invalid closing tag') }
        // Invalid tag name (e.g. <h1#>)
        if (/<[a-zA-Z][a-zA-Z0-9]*[^a-zA-Z0-9\s>"'=\/\-]/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Invalid tag name') }
        // Invalid attribute name (e.g. <div #@id="">)
        var rawNoValues = rawLine.replace(/"[^"]*"|'[^']*'/g, '')
        if (/<[a-zA-Z][a-zA-Z0-9]*\s+[^>]*[^a-zA-Z0-9\s>"'=\/\-:_.]/.test(rawNoValues)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Invalid attribute name') }
        // Unclosed tag - skip, multiline tags are valid
        // Empty tag name (e.g. <> or </>)
        if (/<\s*>|<\/\s*>/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Empty tag name') }
        // Double opening brackets (e.g. <<div>)
        if (/<</.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Double opening bracket') }
        // Attribute value without quotes containing spaces (e.g. <div class=my class>)
        if (/<[a-zA-Z][^>]*=\s*[^\s"'>][^\s"'>]*\s+[a-zA-Z]/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Unquoted attribute value with spaces') }
        // Closing tag with attributes (e.g. </div class="x">)
        if (/<\/[a-zA-Z][a-zA-Z0-9]*\s+[^>]+>/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Closing tag with attributes') }
        // Tag starting with number (e.g. <1div>)
        if (/<[0-9]/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Tag name starts with number') }
        // Duplicate equals in attribute (e.g. <div id=="test">)
        if (/=[^"'>\s]*=/.test(rawLine)) { errorLines[i] = true; console.error('Syntax error (line ' + (i + 1) + '): Duplicate equals sign') }
        // Stray closing bracket - skip, multiline tags are valid
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
