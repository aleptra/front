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
      },
      options.element
    )
    this.markupElement = "display: inline; background: none; color:"
  },

  set: function (object) {
    if (object.exec) object = object.exec.element
    var language = this._detectLanguage(object.innerHTML)

    if (language === 'html') {
      object.innerHTML = this._colorizeHtml(object.innerHTML, this.config.colors)
    } else if (language === 'shell') {
      object.innerHTML = this._colorizeShell(object.innerHTML, this.config.shellColors || this.config.colors)
    } else if (language === 'javascript') {
      object.innerHTML = this._colorizeJavaScript(object.innerHTML, this.config.javascriptColors || this.config.colors)
    }
  },

  _detectLanguage: function (text) {
    text = text.trim()

    // Shell scripts
    if (/^#!(\w+)\/(\w+)/g.test(text)) return 'shell'
    // JavaScript
    if (/\bfunction\s*(\w*\s*)\(/.test(text)) return 'javascript'
    // HTML
    if (/^&lt;!DOCTYPE html&gt;|^&lt;html&gt;/.test(text) || /&lt;[a-z]+\b/.test(text)) return 'html'

    // Default fallback
    return 'html'
  },

  _colorizeHtml: function (text, colors) {
    var color = colors.split(','),
      style = this.markupElement

    // Tags and self-closing tags.
    var rep = text.replace(/(&lt;\/?)(\w+)([\s\S]*?)(\/?)&gt;/g, function (match, p1, tag, attributes, selfClosing) {
      var closed = '',
        selfClosingTag = '',
        colorTag = color[1], // Color for tag names.
        colorSlash = color[0] // Color for angle brackets and self-closing slashes.

      if (p1 === '&lt;/') {
        attributes = '' // Clear attributes for closing tag.
        closed = '/' // Use the same color for the closing slash as for the opening bracket.
      }

      if (selfClosing) {
        selfClosingTag = '<mark style="' + style + colorSlash + '">/</mark>'; // Color for self-closing slash.
      }

      // Colorize Attributes if they exist.
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

      // Apply the same color to closing slash as to opening bracket.
      return '<mark style="' + style + colorSlash + '">&lt;' + closed + '</mark><mark style="' + style + colorTag + '">' + tag + '</mark>' + attributes + selfClosingTag + '<mark style="' + style + colorSlash + '">&gt;</mark>'
    })

    // Comments.
    rep = rep.replace(/(&lt;!--[\s\S]*?--&gt;)/g, function (match, comment) {
      return '<mark style="' + style + color[4] + '">' + comment + '</mark>'
    })

    return rep
  },

  _colorizeShell: function (text, colors) {
    var color = colors.split(','),
      style = this.markupElement

    // Shebang.
    var rep = text.replace(/^#!(\w+)\/(\w+)/g, function (match) {
      return '<mark style="' + style + color[0] + '">' + match + '</mark>'
    })

    return rep
  },

  _colorizeJavaScript: function (text, colors) {
    var color = colors.split(','),
      style = this.markupElement

    // Strings
    var rep = text.replace(/(["'`])(.*?)\1/g, function (match, quote, content) {
      return '<mark style="' + style + color[1] + '">' + quote + content + quote + '</mark>'
    })

    // Comments
    rep = rep.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, function (match) {
      return '<mark style="' + style + color[4] + '">' + match + '</mark>'
    })

    // Keywords
    rep = rep.replace(/\b(function|var|let|const|if|else|for|while|return|true|false|null|undefined|async|await)\b/g, function (match) {
      return '<mark style="' + style + color[0] + '">' + match + '</mark>'
    })

    return rep
  }
}