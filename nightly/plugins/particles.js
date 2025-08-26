'use strict'

app.plugin.particles = {
  config: {
    starCount: 50,   // total stars on screen
    maxSpeed: 1,     // vertical speed
    size: 2,
    color: '#fff'
  },

  load: function(container) {
    var self = this

    // Ensure container has proper styles
    container.style.position = 'relative'
    container.style.overflow = 'hidden'
    if (!container.style.width) container.style.width = '100%'
    if (!container.style.height) container.style.height = '300px'
    if (!container.style.background) container.style.background = 'black'

    var stars = []
    var mouseX = container.offsetWidth / 2
    var mouseY = container.offsetHeight / 2

    // Create stars randomly inside the container
    for (var i = 0; i < self.config.starCount; i++) {
      createStar(Math.random() * container.offsetWidth, Math.random() * container.offsetHeight)
    }

    function createStar(x, y) {
      var star = document.createElement('div')

      // Pure JS styles
      star.style.position = 'absolute';
      star.style.width = self.config.size + 'px'
      star.style.height = self.config.size + 'px'
      star.style.backgroundColor = self.config.color
      star.style.borderRadius = '50%'
      star.style.pointerEvents = 'none'
      star.style.opacity = 0.4
      star.style.left = x + 'px'
      star.style.top = y + 'px'

      // Random vertical speed
      star.speedY = Math.random() * self.config.maxSpeed + 0.5
      star.speedX = 0 // initially no horizontal speed

      container.appendChild(star)
      stars.push(star)
    }

    function animateStars() {
      for (var i = 0; i < stars.length; i++) {
        var star = stars[i]
        var top = parseFloat(star.style.top)
        var left = parseFloat(star.style.left)

        // Move down
        top += star.speedY

        // Move slightly toward mouse
        var dx = (mouseX - left) * 0.002 // small factor
        left += dx

        star.style.top = top + 'px'
        star.style.left = left + 'px'

        // Wrap around vertically
        if (top > container.offsetHeight) {
          star.style.top = '0px'
          star.style.left = Math.random() * container.offsetWidth + 'px'
        }
      }

      requestAnimationFrame(animateStars)
    }

    container.addEventListener('mousemove', function(e) {
      var rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    })

    animateStars()
  }
}