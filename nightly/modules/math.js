'use strict'

app.module.math = {
  round: function (element, value) {
    var value = app.element.get(element)
    app.element.set(element, Math.round(parseFloat(value)))
  },

  compute: function (element, value) {
    var field = element.targetField && !element.targetAttribute ? element.targetField.ownerElement : element
    try {
      var value = app.element.get(field)

      // Allow characters.
      value = value.replace(/[^0-9+\-*/.()^%π]/g, '')

      // Remove leading zeros only from numbers.
      value = value.replace(/\b0+(\d+(\.\d*)?|\.\d+)/g, '$1')

      // Replace '^' with '**' for exponentiation.
      value = value.replace(/\^/g, '**')

      // Replace commas with dots.
      value = value.replace(/,/g, '.')

      // Insert multiplication operator between number and opening parenthesis.
      value = value.replace(/(\d+)(\()/g, '$1*$2')

      // Replace π with Math.PI.
      value = value.replace(/π/g, 'Math.PI')

      value = eval(value) || 0
    } catch (error) {
      value = 0
      console.error(error)
    }

    app.element.set(element, value)
  }
}