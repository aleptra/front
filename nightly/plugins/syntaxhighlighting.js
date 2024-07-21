'use strict'

app.plugin.syntaxhighlighting = {

  __autoload: function () { },

  set: function (object) {
    if (object.exec) object = object.exec.element
    object.innerHTML = this._colorize(object.innerHTML, 'slategray,silver,cornsilk,navajowhite,green')
  },

  _colorize: function (text, colors) {
    var color = colors.split(','),
      rep = '',
      style = "display: inline; background: none; color:"

    // Tags.
    var rep = text.replace(/(&lt;\/?)(\w+)([\s\S]*?)&gt;/g, function (match, p1, tag, attributes) {
      var closed = '', equal = ''
      if (p1 === '&lt;/') {
        attributes = '' // Clear attributes for closing tag
        closed = '/'
      } else {
        // Colorize Attributes if they exist
        if (attributes) {
          attributes = attributes.replace(/(\w+)(=["'][^"']*["'])?/g, function (attrMatch, attrName, attrValue) {
            attrValue = attrValue || '' // Ensure attrValue is not undefined
            if (attrValue[0] === '=') {
              attrValue = attrValue.slice(1)
              equal = '='
            }
            return '<mark style="' + style + color[2] + '">' + attrName + '</mark>' + equal + (attrValue ? '<mark style="' + style + color[3] + '">' + attrValue + '</mark>' : '')
          })
        }
      }

      return '<mark style="' + style + color[0] + '">&lt;</mark>' + closed + '<mark style="' + style + color[1] + '">' + tag + '</mark>' + attributes + '<mark style="' + style + color[0] + '">&gt;</mark>'
    })


    // Comments.
    rep = rep.replace(/(&lt;!--[\s\S]*?--&gt;)/g, function (match, comment) {
      return '<mark style="' + style + color[4] + '">' + comment + '</mark>'
    })

    return rep
  }
}