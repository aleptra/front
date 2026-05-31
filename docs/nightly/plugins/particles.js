'use strict'

app.plugin.particles = {
  config: {
    particles: 50,   // total particles
    maxSpeed: 1,     // vertical speed
    size: 2,
    colors: ['#fff', '#ff0', '#0ff', '#f0f'],
    mousemove: true  // enable/disable mouse tracking
  },

  __autoload: function (options) {
    var conf = app.config.get('particles-', this.config, options.element)
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) this.config[key] = conf[key]
    }
  },

  load: function (container) {
    var self = this

    // Ensure container has proper styles
    container.style.position = 'relative'
    container.style.overflow = 'hidden'

    var particles = []
    var mouseX = container.offsetWidth / 2
    var mouseY = container.offsetHeight / 2

    // Create particles randomly inside the container
    for (var i = 0; i < self.config.particles; i++) {
      createParticle(Math.random() * container.offsetWidth, Math.random() * container.offsetHeight)
    }

    function createParticle(x, y) {
      var particle = document.createElement('div')

      particle.style.position = 'absolute'
      particle.style.width = self.config.size + 'px'
      particle.style.height = self.config.size + 'px'
      var colorIndex = Math.floor(Math.random() * self.config.colors.length)
      particle.style.backgroundColor = self.config.colors[colorIndex]
      particle.style.borderRadius = '50%'
      particle.style.pointerEvents = 'none'
      particle.style.opacity = 0.4
      particle.style.left = x + 'px'
      particle.style.top = y + 'px'

      // Random vertical speed
      particle.speedY = Math.random() * self.config.maxSpeed + 0.5
      particle.speedX = 0 // initially no horizontal speed

      container.appendChild(particle)
      particles.push(particle)
    }

    function animateParticles() {
      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i]
        var top = parseFloat(particle.style.top)
        var left = parseFloat(particle.style.left)

        // Move down
        top += particle.speedY

        // Move slightly toward mouse (if enabled)
        if (self.config.mousemove !== false && self.config.mousemove !== 'false') {
          var dx = (mouseX - left) * 0.002 // small factor
          left += dx
        }

        particle.style.top = top + 'px'
        particle.style.left = left + 'px'

        // Wrap around vertically
        if (top > container.offsetHeight) {
          particle.style.top = '0px'
          particle.style.left = Math.random() * container.offsetWidth + 'px'
        }
      }

      requestAnimationFrame(animateParticles)
    }

    if (self.config.mousemove !== false && self.config.mousemove !== 'false') {
      app.listeners.add(container, 'mousemove', function (e) {
        var rect = container.getBoundingClientRect()
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top
      })
    }

    animateParticles()
  }
}