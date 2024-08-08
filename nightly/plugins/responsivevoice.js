'use strict'

app.plugin.responsivevoice = {
  __autoload: function () {
    var script = document.createElement('script')
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=HoGHbU9L'
    script.onload = function () {
      responsiveVoice.clickEvent()
    }
    document.head.appendChild(script)
  },

  speak: function () {
    if (responsiveVoice.voiceSupport()) {
      responsiveVoice.speak("hello world")
    }
  }
}