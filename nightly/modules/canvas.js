'use strict';

//Experimental

app.module.canvas = {
  grad: function (element) {
    // Ensure the correct element is selected
    var element = element.exec && element.exec.element || element;
    var target = element.getAttribute("canvas-target");

    // Get the canvas and context
    var c = document.querySelector(target); // Use querySelector for better compatibility
    var ctx = c.getContext("2d");

    // Set canvas dimensions
    c.width = parseInt(element.getAttribute("width"), 10);
    c.height = parseInt(element.getAttribute("height"), 10);

    // Apply gradient if canvas-grad is present
    if (element.hasAttribute("canvas-grad")) {
      var orientation = element.getAttribute("canvas-grad-orientation") || "horizontal";
      var grad;
      if (orientation === "vertical") {
        grad = ctx.createLinearGradient(0, 0, 0, c.height);
      } else {
        grad = ctx.createLinearGradient(0, 0, c.width, 0);
      }
      grad.addColorStop(0, "lightblue");
      grad.addColorStop(1, "darkblue");
      ctx.fillStyle = grad;
    }

    // Draw rectangles if canvas-rec is present
    var rectAttr = element.getAttribute("canvas-rec");
    if (rectAttr) {
      var rects = rectAttr.split(';');
      for (var i = 0; i < rects.length; i++) {
        var rectValues = rects[i].split(',');
        if (rectValues.length === 4) {
          var x = parseInt(rectValues[0], 10);
          var y = parseInt(rectValues[1], 10);
          var width = parseInt(rectValues[2], 10);
          var height = parseInt(rectValues[3], 10);
          ctx.fillRect(x, y, width, height);
        }
      }
    }

    // Draw circles if canvas-circle is present
    var circleAttr = element.getAttribute("canvas-circle");
    if (circleAttr) {
      var circles = circleAttr.split(';');
      for (var i = 0; i < circles.length; i++) {
        var circleValues = circles[i].split(',');
        if (circleValues.length === 3) {
          var x = parseInt(circleValues[0], 10);
          var y = parseInt(circleValues[1], 10);
          var radius = parseInt(circleValues[2], 10);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = "orange";  // Default color, can be made configurable
          ctx.fill();
        }
      }
    }

    // Draw text if canvas-text is present
    var textAttr = element.getAttribute("canvas-text");
    if (textAttr) {
      var texts = textAttr.split(';');
      for (var i = 0; i < texts.length; i++) {
        var textValues = texts[i].split(',');
        if (textValues.length === 4) {
          var text = textValues[0];
          var x = parseInt(textValues[1], 10);
          var y = parseInt(textValues[2], 10);
          var color = textValues[3];
          ctx.fillStyle = color || "black";  // Default color if not specified
          ctx.font = "20px Arial";  // Default font style, can be customized
          ctx.textAlign = "left";  // Align text to the left
          ctx.textBaseline = "top";  // Set text baseline to the top
          ctx.fillText(text, x, y);
        }
      }
    }

    // Draw multiple lines if canvas-lines is present
    var linesAttr = element.getAttribute("canvas-lines");
    if (linesAttr) {
      var lines = linesAttr.split(';');
      for (var i = 0; i < lines.length; i++) {
        var lineValues = lines[i].split(',');
        if (lineValues.length === 6) {
          var x1 = parseInt(lineValues[0], 10);
          var y1 = parseInt(lineValues[1], 10);
          var x2 = parseInt(lineValues[2], 10);
          var y2 = parseInt(lineValues[3], 10);
          var width = parseFloat(lineValues[4]);
          var color = lineValues[5];
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = width || 1;  // Default line width
          ctx.strokeStyle = color || "black";  // Default color if not specified
          ctx.stroke();
        }
      }
    }
  },

  clear: function (element) {
    // Implement clear functionality if needed
    var target = element.getAttribute("canvas-target");
    var c = document.querySelector(target);
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
  }
};
