test('app.resetStyles - inserts one reset stylesheet when enabled', function () {
  var oldScript = app.script && app.script.element
  var script = document.createElement('script')
  script.setAttribute('conf', 'resetStyle:true')
  var existing = document.getElementById('front-reset')
  if (existing) existing.parentNode.removeChild(existing)
  app.script = { element: script }
  var inserted = false

  try {
    app.resetStyles()
    app.resetStyles()
    inserted = !!document.querySelector('style#front-reset')
  } finally {
    var style = document.getElementById('front-reset')
    if (style) style.parentNode.removeChild(style)
    app.script = { element: oldScript }
  }

  assertTrue(inserted).desc('reset stylesheet inserted once')
  assertEqual(document.getElementById('front-reset'), null).desc('reset stylesheet cleanup completed')
})
