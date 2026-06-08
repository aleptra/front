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
    // Destroy previous instance if one exists (prevents stacking on SPA navigation)
    if (this._destroy) this._destroy()

    var self = this

    // Read per-element config (attributes on the container override globals)
    var conf = app.config.get('wave-', this.config, container)
    var slices = parseInt(conf.slices, 10) || 40
    var speed = parseFloat(conf.speed) || 0.01
    var amount = parseFloat(conf.amount) || 6
    var src = conf.src || ''

    if (!src) return

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
    var animId = null
    var running = false

    // Cache layout calculations — only recompute on resize
    var layout = {}

    function computeLayout() {
      canvas.width = container.offsetWidth || window.innerWidth
      canvas.height = container.offsetHeight || window.innerHeight

      var imgRatio = img.width / img.height
      var canvasRatio = canvas.width / canvas.height
      var renderWidth = canvas.width
      var renderHeight = canvas.height

      if (canvasRatio > imgRatio) {
        renderHeight = canvas.width / imgRatio
      } else {
        renderWidth = canvas.height * imgRatio
      }

      layout.renderWidth = renderWidth
      layout.renderHeight = renderHeight
      layout.offsetX = (canvas.width - renderWidth) / 2
      layout.offsetY = (canvas.height - renderHeight) / 2
      layout.sliceHeight = renderHeight / slices
      layout.srcSliceHeight = img.height / slices
    }

    function animate() {
      if (!running) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += speed

      var rw = layout.renderWidth
      var ox = layout.offsetX
      var oy = layout.offsetY
      var sh = layout.sliceHeight
      var srcSh = layout.srcSliceHeight

      // Base layer (sharp, unmoving)
      ctx.drawImage(img, ox, oy, rw, layout.renderHeight)

      // Sliced wave layer
      for (var i = 0; i < slices; i++) {
        var waveX = Math.sin(i * 0.15 + time) * amount
        ctx.drawImage(
          img,
          0, srcSh * i, img.width, srcSh,
          ox + waveX, oy + sh * i, rw, sh + 2
        )
      }

      animId = requestAnimationFrame(animate)
    }

    function start() {
      if (!running) {
        running = true
        animate()
      }
    }

    function stop() {
      running = false
      if (animId) {
        cancelAnimationFrame(animId)
        animId = null
      }
    }

    function onResize() {
      if (!img.complete || !img.naturalWidth) return
      computeLayout()
    }

    // Pause when tab is not visible
    function onVisibility() {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    // Cleanup when container is removed from DOM
    function destroy() {
      stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      if (observer) observer.disconnect()
    }

    // Watch for container removal to auto-cleanup
    var observer = null
    if (typeof MutationObserver !== 'undefined' && container.parentNode) {
      observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var removed = mutations[i].removedNodes
          for (var j = 0; j < removed.length; j++) {
            if (removed[j] === container || removed[j].contains(container)) {
              destroy()
              return
            }
          }
        }
      })
      observer.observe(container.parentNode, { childList: true })
    }

    img.onload = function () {
      computeLayout()
      start()
    }

    img.src = src

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    // Expose destroy for manual cleanup and track on plugin instance
    container._waveDestroy = destroy
    self._destroy = destroy
  }
}
