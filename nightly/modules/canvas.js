'use strict'

var app = app || {}
app.module = app.module || {}

app.module.canvas = {
  grad: function (element) {
    element = element.exec && element.exec.element || element
    var target = element.getAttribute("canvas-target")
    var c = document.querySelector(target)
    var ctx = c.getContext("2d")

    function parseCanvasSize(value, parentSize) {
      if (!value) return parentSize
      if (value.toString().indexOf('%') !== -1) {
        return parentSize * parseFloat(value) / 100
      }
      return parseInt(value, 10)
    }

    function setCanvasSize() {
      var parentWidth = c.parentElement.offsetWidth || window.innerWidth,
        parentHeight = c.parentElement.offsetHeight || 2000

      // Set internal resolution
      c.width = parseCanvasSize(element.getAttribute("width"), parentWidth)
      c.height = parseCanvasSize(element.getAttribute("height"), parentHeight)

      // Always clear before redrawing
      ctx.clearRect(0, 0, c.width, c.height)

      // --- 1. GRADIENT LAYER (Optional) ---
      if (element.hasAttribute("canvas-grad")) {
        var orientation = element.getAttribute("canvas-grad-orientation") || "horizontal"
        var grad = orientation === "vertical"
          ? ctx.createLinearGradient(0, 0, 0, c.height)
          : ctx.createLinearGradient(0, 0, c.width, 0)

        var gradStops = element.getAttribute("canvas-grad-stops")
        if (gradStops) {
          var stops = gradStops.split(',')
          stops.forEach(function (item) {
            var stop = item.split('[')
            if (stop.length === 2) {
              var pos = parseFloat(stop[1].replace(']', ''))
              if (!isNaN(pos)) grad.addColorStop(pos, stop[0])
            }
          })
        }
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, c.width, c.height)
      }

      // --- 2. RECTANGLE LAYER (Optional) ---
      var recAttr = element.getAttribute("canvas-rec")
      if (recAttr) {
        var rects = recAttr.split('+')
        rects.forEach(function (rectData) {
          var rv = rectData.split(',')
          if (rv.length >= 4) {
            ctx.fillStyle = rv[4] || "rgba(255,255,255,0.15)"
            ctx.fillRect(
              parseInt(rv[0], 10),
              parseInt(rv[1], 10),
              parseInt(rv[2], 10),
              parseInt(rv[3], 10)
            )
          }
        })
      }

      // --- 3. PATH LINES LAYER (Optional) ---
      var linesAttr = element.getAttribute("canvas-lines")
      if (linesAttr) {
        var separatePaths = linesAttr.split('++')
        separatePaths.forEach(function (pathData) {
          var segments = pathData.split('+')
          var points = segments.map(function (p) {
            var parts = p.split(',')
            return {
              x: parseInt(parts[0], 10),
              y: parseInt(parts[1], 10),
              w: parseFloat(parts[2]) || 10,
              c: parts[3] || "white",
              r: parts[4] === "round"
            }
          })

          if (points.length === 1) {
            // Draw a single dot if only one point exists
            ctx.beginPath()
            ctx.fillStyle = points[0].c
            ctx.arc(points[0].x, points[0].y, points[0].w / 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Draw connected segments
            for (var i = 0; i < points.length - 1; i++) {
              var start = points[i]
              var end = points[i + 1]
              ctx.beginPath()
              ctx.lineWidth = start.w
              ctx.strokeStyle = start.c
              ctx.lineCap = start.r ? "round" : "butt"
              ctx.lineJoin = start.r ? "round" : "miter"
              ctx.moveTo(start.x, start.y)
              ctx.lineTo(end.x, end.y)
              ctx.stroke()
            }
          }
        })
      }

      // --- 4. CIRCLE LAYER (Optional) ---
      var circleAttr = element.getAttribute("canvas-circle")
      if (circleAttr) {
        var circles = circleAttr.split('+')
        circles.forEach(function (cVal) {
          var v = cVal.split(',')
          if (v.length >= 3) {
            ctx.beginPath()
            ctx.arc(parseInt(v[0], 10), parseInt(v[1], 10), parseInt(v[2], 10), 0, 2 * Math.PI)
            ctx.fillStyle = v[3] || "orange"
            ctx.fill()
          }
        })
      }

      // --- 5. TEXT LAYER (Optional) ---
      var textAttr = element.getAttribute("canvas-text")
      if (textAttr) {
        var texts = textAttr.split('+')
        ctx.font = "20px Arial"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        texts.forEach(function (tVal) {
          var v = tVal.split(',')
          if (v.length >= 3) {
            ctx.fillStyle = v[3] || "black"
            ctx.fillText(v[0], parseInt(v[1], 10), parseInt(v[2], 10))
          }
        })
      }
    }

    // Delay ensures parent element dimensions are calculated correctly
    setTimeout(setCanvasSize, 500)
    window.addEventListener('resize', setCanvasSize)
  },

  clear: function (element) {
    var target = element.getAttribute("canvas-target")
    var c = document.querySelector(target)
    if (c) {
      c.getContext("2d").clearRect(0, 0, c.width, c.height)
    }
  }
}