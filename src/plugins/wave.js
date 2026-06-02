'use strict'

app.plugin.wave = {
  config: {
    src: '',
    slices: 40,
    speed: 0.01,
    amount: 6
  },

  __autoload: function (options) {
    var conf = app.config.get('wave-', this.config, options.element)
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) this.config[key] = conf[key]
    }
  },

  load: function (container) {
    var self = this
    var confAttr = container.getAttribute('wave--conf')
    if (confAttr) {
      var conf = app.parse.attribute(confAttr)
      for (var key in conf) {
        if (conf.hasOwnProperty(key)) this.config[key] = conf[key]
      }
    }
    this.config.slices = parseInt(this.config.slices) || 40
    this.config.speed = parseFloat(this.config.speed) || 0.01
    this.config.amount = parseFloat(this.config.amount) || 6

    var canvas = document.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.style.position = 'relative'
    container.style.overflow = 'hidden'
    container.appendChild(canvas)

    var ctx = canvas.getContext('2d')
    var img = new Image()
    var time = 0
    var overlap = 2

    function resize() {
      canvas.width = container.offsetWidth || window.innerWidth
      canvas.height = container.offsetHeight || window.innerHeight
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      var imgRatio = img.width / img.height
      var canvasRatio = canvas.width / canvas.height
      var renderWidth = canvas.width
      var renderHeight = canvas.height

      if (canvasRatio > imgRatio) {
        renderHeight = canvas.width / imgRatio
      } else {
        renderWidth = canvas.height * imgRatio
      }

      var offsetX = (canvas.width - renderWidth) / 2
      var offsetY = (canvas.height - renderHeight) / 2

      time += self.config.speed

      // Base layer
      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight)

      // Sliced wave layer
      var sliceHeight = renderHeight / self.config.slices
      for (var i = 0; i < self.config.slices; i++) {
        var sy = (img.height / self.config.slices) * i
        var sh = img.height / self.config.slices
        var dy = offsetY + (sliceHeight * i)
        var waveX = Math.sin(i * 0.15 + time) * self.config.amount

        ctx.drawImage(
          img,
          0, sy, img.width, sh,
          offsetX + waveX, dy, renderWidth, sliceHeight + overlap
        )
      }

      requestAnimationFrame(animate)
    }

    img.onload = function () {
      resize()
      animate()
    }

    img.src = self.config.src

    app.listeners.add(window, 'resize', resize)
  }
}