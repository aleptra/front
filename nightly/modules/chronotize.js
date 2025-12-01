'use strict'

app.module.chronotize = {
  _weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  _month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  // Private marker property (never touches DOM)
  _marker: '__chronotized',

  get: function (element) {
    var format = element.getAttribute('chronotize-get')

    // Fast path: already processed?
    if (element[this._marker]) {
      return
    }

    var raw = app.element.get(element) || new Date()
    var date = new Date(raw)

    var parts = {
      d: ('0' + date.getDate()).slice(-2),
      m: ('0' + (date.getMonth() + 1)).slice(-2),
      y: ('' + date.getFullYear()).slice(-2),
      Y: date.getFullYear(),
      F: this._month[date.getMonth()],
      H: ('0' + date.getHours()).slice(-2),
      i: ('0' + date.getMinutes()).slice(-2),
      s: ('0' + date.getSeconds()).slice(-2),
      W: this._weekday[date.getDay()]
    }

    var formatted = format.replace(/[dmyYFHisfW]/g, function (token) {
      return (parts.hasOwnProperty(token) ? parts[token] : token)
    })

    // Mark as done — invisible, zero overhead
    element[this._marker] = true
    app.element.set(element, formatted)
  },

  age: function (element) {
    if (element[this._marker]) {
      return
    }

    var input = (element.textContent || '').trim()
    if (!input) {
      return
    }

    var patterns = [
      /^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})/,
      /^(\d{4})(\d{2})(\d{2})$/,
      /^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})[ T]/
    ]

    var i, regex, m, year, month, day, birth, age

    for (i = 0; i < patterns.length; i++) {
      regex = patterns[i]
      m = input.match(regex)
      if (!m) {
        continue
      }

      year = +m[1]
      month = +m[2]
      day = +(m[3] || 1)

      // Handle ambiguous MM/DD vs DD/MM when month > 12
      if (m[2].length === 2 && month > 12) {
        // swap
        month = +m[3]
        day = +m[2]
      }
      month -= 1 // JS months are 0-based

      birth = new Date(year, month, day)
      if (isNaN(birth)) {
        continue
      }

      age = new Date(Date.now() - birth).getUTCFullYear() - 1970

      element[this._marker] = true
      app.element.set(element, age)
      return
    }
  }
}