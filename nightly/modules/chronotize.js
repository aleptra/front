'use strict'
app.module.chronotize = {
  _weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  _month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  get: function (element) {
    var value = app.element.get(element) || new Date(),
      date = new Date(value),
      format = element.getAttribute('chronotize-get'),
      dateParts = {
        'd': ('0' + date.getDate()).slice(-2),
        'm': ('0' + (date.getMonth() + 1)).slice(-2),
        'y': ('' + date.getFullYear()).slice(-2),
        'F': this._month[date.getMonth()],
        'Y': date.getFullYear(),
        'H': ('0' + date.getHours()).slice(-2),
        'i': ('0' + date.getMinutes()).slice(-2),
        's': ('0' + date.getSeconds()).slice(-2),
        'W': this._weekday[date.getDay()]
      }

    // Use a more straightforward regular expression
    var formatted = format.replace(/[dmyYHisWF]/g, function (match) {
      return dateParts[match] || match
    })

    app.element.set(element, formatted)
  },

  _weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekday: function (element) {
    var date = new Date(element.innerHTML),
      dayIndex = date.getDay(),
      setValue = this._weekdays[dayIndex]

    element.renderedText = setValue
    app.element.set(element, setValue)
  },

  age: function (element) {
    var input = element.innerHTML,
      formats = [
        /(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})/,
        /(\d{2})[\/.-](\d{1,2})[\/.-](\d{1,2})/,
        /(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})[ T](\d{1,2}):(\d{1,2}):(\d{1,2})/,
        /(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})[ T](\d{1,2}):(\d{1,2})/,
        /(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})[ T](\d{1,2})/,
        /(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})/,
        /(\d{4}) ([a-zA-Z]+) (\d{1,2})/,
        /(\d{4}) ([a-zA-Z]+)/,
        /(\d{4}) (\d{1,2}) (\d{1,2})/,
        /(\d{4})(\d{2})(\d{2})/
      ]

    for (var i = 0; i < formats.length; i++) {
      var match = input.match(formats[i])
      if (match) {
        var year = parseInt(match[1], 10),
          month = parseInt(match[2], 10) - 1,
          day = parseInt(match[3], 10),
          birthdateObject = new Date(year, month, day)

        if (birthdateObject) {
          var age = new Date() - birthdateObject,
            calculatedAge = new Date(age).getUTCFullYear() - 1970
          app.element.set(element, calculatedAge)
        }

        break
      }
    }
  }
}