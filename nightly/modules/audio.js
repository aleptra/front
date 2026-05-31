'use strict';

//Experimental

app.module.audio = {
  play: function (object, value) {
    var value = object.exec.value,
      audio = new Audio(value)
    audio.play()
  }
}