test('action-dispatch - representative public aliases resolve to shared handlers', function () {
  var aliases = {
    trimleft: 'trim',
    trimright: 'trim',
    moveafter: 'move',
    moveafterend: 'move',
    settext: 'set2',
    sethtml: 'set2',
    setvalue: 'set2',
    bindvar: 'bind',
    bindquery: 'bind',
    resetvalue: 'reset',
    togglevalue: 'toggle',
    maptext: 'map',
    align: 'apply',
    bottom: 'apply',
    sticky: 'apply',
    valign: 'apply'
  }
  var key
  for (key in aliases) {
    if (aliases.hasOwnProperty(key)) assertEqual(dom._actionMap[key], aliases[key])
  }
})

test('action-dispatch - module and plugin commands route through app.call', function () {
  var element = createElement('div')
  var originalModule = app.module.dispatchtest
  var moduleCalled = false
  app.module.dispatchtest = {
    ping: function (object) {
      moduleCalled = object.exec.element === element
    }
  }

  try {
    app.call('dispatchtest-ping:#' + element.id)
  } finally {
    if (originalModule) app.module.dispatchtest = originalModule
    else delete app.module.dispatchtest
  }
  assertTrue(moduleCalled)

  var plugin = app.plugin.dispatchtest
  var pluginCalled = false
  app.plugin.dispatchtest = {
    ping: function (object) {
      pluginCalled = object.exec.element === element
    }
  }
  try {
    app.call('dispatchtest--ping:#' + element.id)
  } finally {
    if (plugin) app.plugin.dispatchtest = plugin
    else delete app.plugin.dispatchtest
  }
  assertTrue(pluginCalled)
})

test('action-dispatch - click alias invokes onclicked once', function () {
  var element = createElement('button')
  element.setAttribute('onclicked', 'settext:[clicked]')
  app.attributes.run([element])

  app.call('click:#' + element.id)
  app.call('click:#' + element.id)

  assertEqual(element.textContent, 'clicked')
})
