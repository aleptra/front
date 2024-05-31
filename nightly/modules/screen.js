'use strict'

app.module.screen = {
  __autoload: function (options) {
    this.module = options.name
    var self = this

    app.globals.screenHeight = screen.height,
    app.globals.screenWidth = screen.width,
    app.globals.windowHeight = window.innerHeight,
    app.globals.windowWidth = window.innerWidth,
    
    app.listeners.add(document, 'resize', function () {
      app.globals.windowHeight = window.innerHeight,
      app.globals.windowWidth = window.innerWidth
    })
  },
}