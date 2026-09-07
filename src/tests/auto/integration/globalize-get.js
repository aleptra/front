test('globalize-get - reads cached translations through globalize-get', function () {
  var globalize = app.module.globalize
  var oldModule = globalize.module
  var oldCached = globalize.cachedData
  var oldKey = globalize.storageKey
  globalize.module = 'globalize'
  globalize.storageKey = 'globalize.en'
  globalize.cachedData = { data: { translations: { greeting: 'Hello' }, title: 'Root title' } }
  try {
    var element = createElement('span')
    element.setAttribute('globalize-get', 'greeting')
    app.call('rerun', { element: element })
    assertEqual(element.textContent, 'Hello')
  } finally {
    globalize.module = oldModule
    globalize.cachedData = oldCached
    globalize.storageKey = oldKey
  }
})
