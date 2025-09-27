'use strict'

app.plugin.syntaxhighlighting = {

  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      {
        colors: 'slategray,silver,cornsilk,navajowhite,green',
      },
      options.element
    )
  },

  set: function (object) {
    if (object.exec) object = object.exec.element
    object.innerHTML = this._colorize(object.innerHTML, this.config.colors)
  },

  _colorize: function (text, colors) {
    var color = colors.split(','),
      style = "display: inline; background: none; color:"

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
        attributes = attributes.replace(/(\w+)(=["'][^"']*["'])?/g, function (attrMatch, attrName, attrValue) {
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
  }
}