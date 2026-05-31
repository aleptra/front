'use strict'

app.plugin.responsivevoice = {
  __autoload: function () {
    var script = document.createElement('script')
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=HoGHbU9L'
    script.defer = true

    script.onload = function () {
      responsiveVoice.init()
    }

    document.head.appendChild(script)
  },

  speak: function (object) {
    var value = object.exec.value
    responsiveVoice.cancel()
    responsiveVoice.speak(value, 'Arabic Male')
  }
}