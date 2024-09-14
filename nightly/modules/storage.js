'use strict'

app.module.storage = {
  set: function (value) {
    localStorage.setItem('test', value)
  }
}