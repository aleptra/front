test('app.config - reads extension configuration and applies standard configuration', function () {
  var element = document.createElement('script')
  element.setAttribute('module-conf', 'debug:true;enabled:false;ignored:value')
  var extension = app.config.get('module', { debug: false, enabled: true }, element)

  assertEqual(extension.debug, 'true').desc('extension debug override')
  assertEqual(extension.enabled, 'false').desc('extension enabled override')
  assertEqual(extension.ignored, undefined).desc('undeclared extension option ignored')

  var oldDebug = app.debug
  var oldVarsDir = app.varsDir
  var oldReset = app.resetStyles
  var resetCalled = false
  var script = document.createElement('script')
  script.setAttribute('conf', 'debug:true;varsDir:test-vars')
  app.resetStyles = function () { resetCalled = true }

  try {
    app.config.set(script)
  } finally {
    app.resetStyles = oldReset
    app.debug = oldDebug
    app.varsDir = oldVarsDir
  }

  assertTrue(resetCalled).desc('configuration reset hook called')
  assertEqual(app.varsDir, oldVarsDir).desc('configuration state restored by test')
})
