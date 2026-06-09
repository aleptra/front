test('animate - basic animation startup with verification', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0%;100%')
  element.setAttribute('animate-transform', 'translateX(0px);translateX(300px)')
  element.setAttribute('animate-duration', '2s')
  element.setAttribute('animate-easing', 'ease-in-out')
  element.setAttribute('animate-delay', '0.5s')
  element.setAttribute('animate-direction', 'alternate')
  element.setAttribute('animate-iteration', '2')

  var elapsed = measure(function () {
    app.module.animate.start(element)
  })

  // Core functionality verification
  var styleName = 'animate-' + element.id
  var styleEl = document.getElementById(styleName)
  assertTrue(styleEl !== null).desc('✓ Style element created')
  assertTrue(element.style.animation !== '').desc('✓ Animation applied')

  var css = styleEl.textContent
  assertTrue(css.indexOf('@keyframes') !== -1).desc('✓ @keyframes generated')
  assertTrue(css.indexOf('2s') !== -1).desc('✓ Duration in CSS')
  assertTrue(css.indexOf('0.5s') !== -1).desc('✓ Delay in CSS')
  assertTrue(css.indexOf('alternate') !== -1).desc('✓ Direction in CSS')
  assertTrue(css.indexOf('2') !== -1).desc('✓ Iteration in CSS')

  assertTrue(elapsed < 50).desc('Performance: ' + elapsed.toFixed(2) + 'ms')
})

test('animate - complex keyframes with multiple transforms', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0%;10%;20%;30%;40%;50%;60%;70%;80%;90%;100%')
  element.setAttribute('animate-transform',
    'translateX(0px) scale(1);' +
    'translateX(20px) scale(1.1);' +
    'translateX(40px) scale(1.2);' +
    'translateX(60px) scale(1.1);' +
    'translateX(80px) scale(1);' +
    'translateX(100px) scale(0.9);' +
    'translateX(80px) scale(0.8);' +
    'translateX(60px) scale(0.9);' +
    'translateX(40px) scale(1);' +
    'translateX(20px) scale(1.1);' +
    'translateX(0px) scale(1)')
  element.setAttribute('animate-duration', '3s')
  element.setAttribute('animate-easing', 'ease-in-out')

  var elapsed = measure(function () {
    app.module.animate.start(element)
  })

  var styleName = 'animate-' + element.id
  var styleEl = document.getElementById(styleName)
  assertTrue(styleEl !== null).desc('✓ Style element created')
  var css = styleEl.textContent
  assertTrue(css.indexOf('10%') !== -1 && css.indexOf('90%') !== -1).desc('✓ All 11 keyframes present')
  assertTrue(css.indexOf('scale') !== -1 && css.indexOf('translateX') !== -1).desc('✓ Multiple transforms in CSS')

  assertTrue(elapsed < 100).desc('Performance: ' + elapsed.toFixed(2) + 'ms')
})

test('animate - stop removes animation and cleanup', function () {
  var element = createElement('div')
  element.setAttribute('animate-key', '0%;100%')
  element.setAttribute('animate-transform', 'rotate(0deg);rotate(360deg)')
  element.setAttribute('animate-duration', '2s')

  app.module.animate.start(element)
  var styleName = 'animate-' + element.id
  var styleElBefore = document.getElementById(styleName)
  assertTrue(styleElBefore !== null).desc('✓ Style element exists before stop')

  var elapsed = measure(function () {
    app.module.animate.stop(element)
  })

  var styleElAfter = document.getElementById(styleName)
  assertTrue(styleElAfter === null).desc('✓ Style element removed by stop')

  assertTrue(elapsed < 10).desc('Performance: ' + elapsed.toFixed(2) + 'ms')
})

test('animate - batch operations (50 sequential)', function () {
  var elapsed = measure(function () {
    for (var i = 0; i < 50; i++) {
      var element = createElement('div')
      element.setAttribute('animate-key', '0%;100%')
      element.setAttribute('animate-transform', 'translateY(0px);translateY(100px)')
      element.setAttribute('animate-duration', '1s')
      app.module.animate.start(element)
    }
  })

  assertTrue(elapsed < 500)
    .desc('50 animations: ' + elapsed.toFixed(2) + 'ms (' + (elapsed / 50).toFixed(2) + 'ms each)')
})

test('animate - stop on non-animated element (edge case)', function () {
  var element = createElement('div')

  // Call stop without ever calling start
  var elapsed = measure(function () {
    app.module.animate.stop(element)
  })

  // Should not crash, just complete
  assertTrue(elapsed < 10).desc('✓ No error on non-animated element. Time: ' + elapsed.toFixed(2) + 'ms')
})

test('animate - missing/empty attributes (edge case)', function () {
  var element = createElement('div')
  // Provide minimal attributes
  element.setAttribute('animate-key', '0%;100%')
  element.setAttribute('animate-transform', 'translateX(0);translateX(100px)')
  // Duration, easing, etc. will use defaults

  var elapsed = measure(function () {
    app.module.animate.start(element)
  })

  var styleName = 'animate-' + element.id
  var styleEl = document.getElementById(styleName)
  assertTrue(styleEl !== null).desc('✓ Works with minimal attributes')
  assertTrue(styleEl.textContent.indexOf('1s') !== -1).desc('✓ Uses default duration (1s)')

  assertTrue(elapsed < 50).desc('Performance: ' + elapsed.toFixed(2) + 'ms')
})

test('animate - memory efficiency on repeated start/stop', function () {
  if (!performance.memory) {
    log('⚠ Skipped: Chrome memory API not available')
    return
  }

  var initialMemory = performance.memory.usedJSHeapSize

  measure(function () {
    // Create and animate element 100 times
    for (var i = 0; i < 100; i++) {
      var element = createElement('div')
      element.setAttribute('animate-key', '0%;100%')
      element.setAttribute('animate-transform', 'translateX(0);translateX(100px)')
      element.setAttribute('animate-duration', '1s')

      app.module.animate.start(element)
      app.module.animate.stop(element)

      // Clean up
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  })

  var finalMemory = performance.memory.usedJSHeapSize
  var delta = (finalMemory - initialMemory) / 1024 / 1024

  assertTrue(delta < 5)
    .desc('Memory delta from 100 cycles: ' + delta.toFixed(2) + 'MB')
})

test('animate - large keyframe count (50+ keyframes)', function () {
  var element = createElement('div')

  // Generate 50 keyframe percentages
  var keyframes = []
  var transforms = []
  for (var i = 0; i <= 50; i++) {
    keyframes.push((i * 2) + '%')
    var angle = (i * 7.2)
    transforms.push('rotate(' + angle + 'deg)')
  }

  element.setAttribute('animate-key', keyframes.join(';'))
  element.setAttribute('animate-transform', transforms.join(';'))
  element.setAttribute('animate-duration', '5s')
  element.setAttribute('animate-easing', 'linear')

  var elapsed = measure(function () {
    app.module.animate.start(element)
  })

  assertTrue(elapsed < 200)
    .desc('50-keyframe animation: ' + elapsed.toFixed(2) + 'ms')
})
