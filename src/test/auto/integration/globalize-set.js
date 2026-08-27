test('globalize-set - loads a selected locale through globalize-set', function () {
  var globalize = app.module.globalize
  var oldModule = globalize.module
  globalize.module = 'globalize'
  var loaded
  withStub(globalize._locale, 'load', function (config, owner, run) {
    loaded = { config: config, owner: owner, run: run }
  }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'globalize-set:[fr]')
    app.call(button.getAttribute('click'), { srcElement: button })
  })
  globalize.module = oldModule
  assertEqual(loaded.config.language, 'fr')
  assertTrue(loaded.run)
})
