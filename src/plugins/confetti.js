'use strict'

app.plugin.confetti = {
  config: {
    count: 30,
    src: '',
    colors: '#ff0;#f0f;#0ff;#f00;#0f0;#00f',
    size: 10,
    speed: 1.5,
    direction: 'down',
    wobble: true,
    rotate: true
  },

  __autoload: function (options) {
    var conf = app.config.get('confetti-', this.config, options.element)
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) this.config[key] = conf[key]
    }
  },

  load: function (container) {
    var self = this
    var count = Math.min(parseInt(container.getAttribute('confetti-count') || self.config.count, 10), 200)
    var size = Math.min(parseInt(container.getAttribute('confetti-size') || self.config.size, 10), 100)
    var speed = parseFloat(container.getAttribute('confetti-speed') || self.config.speed)
    var src = container.getAttribute('confetti-src') || self.config.src
    var colors = (container.getAttribute('confetti-colors') || self.config.colors).split(';')
    var direction = container.getAttribute('confetti-direction') || self.config.direction
    var wobble = container.getAttribute('confetti-wobble')
    var rotate = container.getAttribute('confetti-rotate')
    wobble = wobble === null ? self.config.wobble : wobble !== 'false'
    rotate = rotate === null ? self.config.rotate : rotate !== 'false'

    if (!src && !colors.length) return

    container.style.position = 'relative'
    container.style.overflow = 'hidden'

    var items = []
    var srcs = src ? src.split(';') : []
    var shapes = ['rect', 'circle', 'strip']
    var W = container.offsetWidth || parseInt(container.getAttribute('width')) || 500
    var H = container.offsetHeight || parseInt(container.getAttribute('height')) || 500

    for (var i = 0; i < count; i++) {
      var item

      if (srcs.length) {
        item = document.createElement('img')
        item.src = srcs[Math.floor(Math.random() * srcs.length)]
        item.style.width = size + 'px'
        item.style.height = size + 'px'
      } else {
        item = document.createElement('div')
        var shape = shapes[Math.floor(Math.random() * shapes.length)]
        var w = shape === 'strip' ? size * 0.3 : size
        var h = shape === 'strip' ? size : shape === 'rect' ? size * 0.6 : size
        item.style.width = w + 'px'
        item.style.height = h + 'px'
        item.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        item.style.borderRadius = shape === 'circle' ? '50%' : '2px'
      }

      item.style.position = 'absolute'
      item.style.pointerEvents = 'none'
      item.style.opacity = 0.7 + Math.random() * 0.3
      item._speed = (Math.random() * speed) + speed * 0.5
      item._wobble = (Math.random() - 0.5) * 2
      item._rot = Math.random() * 360
      item._rotSpeed = (Math.random() - 0.5) * 4
      item._x = Math.random() * W
      item._y = direction === 'down' ? -(Math.random() * H) :
        direction === 'up' ? H + (Math.random() * H) : Math.random() * H

      if (direction === 'left') { item._x = W + (Math.random() * W); item._y = Math.random() * H }
      if (direction === 'right') { item._x = -(Math.random() * W); item._y = Math.random() * H }

      item.style.left = item._x + 'px'
      item.style.top = item._y + 'px'

      container.appendChild(item)
      items.push(item)
    }

    function animate() {
      for (var i = 0; i < items.length; i++) {
        var item = items[i]

        if (direction === 'down') {
          item._y += item._speed
          if (wobble) item._x += item._wobble
          if (item._y > H) { item._y = -size; item._x = Math.random() * W }
        } else if (direction === 'up') {
          item._y -= item._speed
          if (wobble) item._x += item._wobble
          if (item._y < -size) { item._y = H + size; item._x = Math.random() * W }
        } else if (direction === 'left') {
          item._x -= item._speed
          if (wobble) item._y += item._wobble
          if (item._x < -size) { item._x = W + size; item._y = Math.random() * H }
        } else if (direction === 'right') {
          item._x += item._speed
          if (wobble) item._y += item._wobble
          if (item._x > W) { item._x = -size; item._y = Math.random() * H }
        }

        if (rotate) {
          item._rot += item._rotSpeed
          item.style.transform = 'rotate(' + item._rot + 'deg)'
        }

        item.style.left = item._x + 'px'
        item.style.top = item._y + 'px'
      }

      requestAnimationFrame(animate)
    }

    animate()
  }
}
