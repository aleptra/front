'use strict'

app.module.animate = {
  start: function (element, value) {

    console.dir(element)
    var element = element.exec && element.exec.element || element,
      keyframePercentages = (element.getAttribute("animate-key") || '').replace(/\s*;\s*/g, ';').split(';'),
      transforms = (element.getAttribute("animate-transform") || '').replace(/\s*;\s*/g, ';').split(';'),
      easing = element.getAttribute("animate-easing"),
      duration = element.getAttribute("animate-duration") || '1s',
      delay = element.getAttribute("animate-delay") || '0s',
      direction = element.getAttribute("animate-direction") || 'normal',
      iteration = element.getAttribute("animate-iteration") || 1,
      name = 'animate-' + element.id,
      keyframesCSS = '',
      animation = name + ' ' + duration + ' ' + easing + ' ' + delay + ' ' + iteration + ' ' + direction
console.error(name)
    // Generate CSS for keyframes
    for (var j = 0; j < keyframePercentages.length; j++) {
      var percentage = keyframePercentages[j] || (j * (100 / (keyframePercentages.length - 1)))
      keyframesCSS += percentage + '% { transform: ' + transforms[j] + ' }'
    }

    // Remove old style if it exists
    var oldStyleElement = document.getElementById(name)
    if (oldStyleElement) document.head.removeChild(oldStyleElement)

    // Create and append new style element
    var styleElement = document.createElement('style')
    styleElement.id = name
    document.head.appendChild(styleElement)
    var css = '@keyframes ' + name + ' {' + keyframesCSS + '}' +
      '#' + name + '{' + 'animation: ' + animation + '}'
    styleElement.textContent = css

    // Reset animation
    element.style.animation = 'none' // Remove existing animation
    element.offsetHeight // Trigger reflow to reset animation
    element.style.animation = animation // Reapply animation
  }
}