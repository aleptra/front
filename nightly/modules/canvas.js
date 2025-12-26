'use strict'

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
      var parentWidth = c.parentElement.offsetWidth || window.innerWidth
      var parentHeight = c.parentElement.offsetHeight || 500

      c.width = parseCanvasSize(element.getAttribute("width"), parentWidth)
      c.height = parseCanvasSize(element.getAttribute("height"), parentHeight)

      ctx.clearRect(0, 0, c.width, c.height)

      if (element.hasAttribute("canvas-grad")) {
        var orientation = element.getAttribute("canvas-grad-orientation") || "horizontal"
        var grad = orientation === "vertical" ? ctx.createLinearGradient(0, 0, 0, c.height) : ctx.createLinearGradient(0, 0, c.width, 0)
        var gradStops = element.getAttribute("canvas-grad-stops")
        if (gradStops) {
          var stops = gradStops.split(',')
          for (var i = 0; i < stops.length; i++) {
            var stop = stops[i].split('[')
            if (stop.length === 2) {
              var pos = parseFloat(stop[1].replace(']', ''))
              if (!isNaN(pos) && isFinite(pos)) {
                grad.addColorStop(pos, stop[0])
              }
            }
          }
        }
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, c.width, c.height)
      }

      var rectAttr = element.getAttribute("canvas-rec")
      if (rectAttr) {
        var rects = rectAttr.split('+')
        for (var i = 0; i < rects.length; i++) {
          var rectValues = rects[i].split(',')
          if (rectValues.length === 4) {
            ctx.fillRect(parseInt(rectValues[0], 10), parseInt(rectValues[1], 10), parseInt(rectValues[2], 10), parseInt(rectValues[3], 10))
          }
        }
      }

      var circleAttr = element.getAttribute("canvas-circle")
      if (circleAttr) {
        var circles = circleAttr.split('+')
        for (var i = 0; i < circles.length; i++) {
          var circleValues = circles[i].split(',')
          if (circleValues.length === 3) {
            ctx.beginPath()
            ctx.arc(parseInt(circleValues[0], 10), parseInt(circleValues[1], 10), parseInt(circleValues[2], 10), 0, 2 * Math.PI)
            ctx.fillStyle = "orange"
            ctx.fill()
          }
        }
      }

      var textAttr = element.getAttribute("canvas-text")
      if (textAttr) {
        var texts = textAttr.split('+')
        ctx.font = "20px Arial"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        for (var i = 0; i < texts.length; i++) {
          var textValues = texts[i].split(',')
          if (textValues.length === 4) {
            ctx.fillStyle = textValues[3] || "black"
            ctx.fillText(textValues[0], parseInt(textValues[1], 10), parseInt(textValues[2], 10))
          }
        }
      }

      var linesAttr = element.getAttribute("canvas-lines")
      if (linesAttr) {
        var lines = linesAttr.split('+')
        for (var i = 0; i < lines.length; i++) {
          var lineValues = lines[i].split(',')
          if (lineValues.length === 6) {
            ctx.beginPath()
            ctx.moveTo(parseInt(lineValues[0], 10), parseInt(lineValues[1], 10))
            ctx.lineTo(parseInt(lineValues[2], 10), parseInt(lineValues[3], 10))
            ctx.lineWidth = parseFloat(lineValues[4]) || 1
            ctx.strokeStyle = lineValues[5] || "black"
            ctx.stroke()
          }
        }
      }
    }

    // Todo: Needs a better solution.
    setTimeout(function () {
      setCanvasSize()
    }, 500)
    window.addEventListener('resize', setCanvasSize)
  },

  clear: function (element) {
    var target = element.getAttribute("canvas-target")
    var c = document.querySelector(target)
    var ctx = c.getContext("2d")
    ctx.clearRect(0, 0, c.width, c.height)
  }
}