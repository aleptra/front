test('app.assets.set - separates modules, plugins, and variables', function () {
  var oldExtensions = app.extensions
  var oldVars = app.vars
  try {
    app.assets.set({
      module: { value: 'data;math' },
      plugin: { value: 'toc' },
      var: { value: 'colors;labels' }
    })

    assertEqual(app.extensions.module.join(','), 'data,math').desc('module list parsed')
    assertEqual(app.extensions.plugin.join(','), 'toc').desc('plugin list parsed')
    assertEqual(app.extensions.total, 3).desc('extension total calculated')
    assertEqual(app.vars.name.join(','), 'colors,labels').desc('variable list parsed')
    assertEqual(app.vars.total, 2).desc('variable total calculated')
  } finally {
    app.extensions = oldExtensions
    app.vars = oldVars
  }
})

test('app.assets.get.vars - requests a missing variable and finalizes cached variables', function () {
  var oldVars = app.vars
  var oldVarsDir = app.varsDir
  var request
  var finalized = 0
  app.vars = { total: 1, totalStore: 0, loaded: 0, name: ['coverage-missing'] }
  app.varsDir = 'coverage-vars'
  app.caches.remove('session', 'coverage-missing')

  try {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      app.assets.get.vars()
    })
    assertEqual(request.url, 'coverage-vars/coverage-missing.json').desc('missing variable URL built')
    assertEqual(request.type, 'var').desc('variable request type set')

    app.caches.set('session', 'var', 'coverage-cached', { data: '{"ready":true}' }, 'json')
    app.vars = { total: 1, totalStore: 0, loaded: 0, name: ['coverage-cached'] }
    withStub(app.xhr, 'finalize', function () { finalized++ }, function () {
      app.assets.get.vars()
    })
    assertEqual(app.vars.loaded, 1).desc('cached variable counted')
    assertEqual(finalized, 1).desc('cached variable finalized')
  } finally {
    app.vars = oldVars
    app.varsDir = oldVarsDir
    app.caches.remove('session', 'coverage-cached')
  }
})

test('app.assets.get.extensions - loads module and plugin scripts and autoloads them', function () {
  var oldExtensions = app.extensions
  var oldModule = app.module.coverageModule
  var oldPlugin = app.plugin.coveragePlugin
  var oldScript = app.script
  var scripts = []
  var moduleLoaded = false
  var pluginLoaded = false
  var varsCalled = false

  app.extensions = { module: ['coverageModule'], plugin: ['coveragePlugin'], total: 2, loaded: 0 }
  app.script = { path: '/coverage/', element: document.createElement('script') }
  app.module.coverageModule = { __autoload: function () { moduleLoaded = true } }
  app.plugin.coveragePlugin = { __autoload: function () { pluginLoaded = true } }

  try {
    withStub(document.head, 'appendChild', function (script) { scripts.push(script) }, function () {
      withStub(app.assets.get, 'vars', function () { varsCalled = true }, function () {
        app.assets.get.extensions()
        scripts[0].onload.call(scripts[0])
        scripts[1].onload.call(scripts[1])
      })
    })

    assertEqual(scripts.length, 2).desc('module and plugin scripts created')
    assertEqual(scripts[0].getAttribute('src'), '/coverage/modules/coverageModule.js').desc('module source built')
    assertEqual(scripts[1].getAttribute('src'), '/coverage/plugins/coveragePlugin.js').desc('plugin source built')
    assertTrue(scripts[0].defer).desc('module script deferred')

    assertTrue(moduleLoaded).desc('module autoload called')
    assertTrue(pluginLoaded).desc('plugin autoload called')
    assertTrue(varsCalled).desc('variables loaded after extensions')
  } finally {
    app.extensions = oldExtensions
    app.script = oldScript
    if (oldModule) app.module.coverageModule = oldModule
    else delete app.module.coverageModule
    if (oldPlugin) app.plugin.coveragePlugin = oldPlugin
    else delete app.plugin.coveragePlugin
  }
})

test('app.assets.get.templates - requests srcdoc and named templates', function () {
  var oldTemplate = app.srcTemplate
  var requests = []
  app.srcTemplate = {
    url: { srcDoc: 'start', src: ['header', 'footer'] },
    total: 3
  }

  try {
    withStub(app.xhr, 'request', function (options) { requests.push(options) }, function () {
      app.assets.get.templates()
    })
  } finally {
    app.srcTemplate = oldTemplate
  }

  assertEqual(requests.length, 3).desc('all templates requested')
  assertEqual(requests[0].type, 'template').desc('template request type set')
  assertTrue(requests[0].isSrcDoc).desc('srcdoc request marked')
  assertTrue(requests[1].url.indexOf('/header.html') !== -1).desc('named template URL built')
})
