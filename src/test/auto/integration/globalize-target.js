test('globalize-target - writes the translation into the named attribute', function () {
  var globalize = app.module.globalize
  var oldModule = globalize.module
  var oldCached = globalize.cachedData
  var oldKey = globalize.storageKey

  globalize.module = 'globalize'
  globalize.storageKey = 'globalize.en'
  globalize.cachedData = { data: { translations: { input_search: 'Search the docs' } } }

  try {
    var element = createElement('input')
    element.setAttribute('globalize-get', 'input_search')
    element.setAttribute('globalize-target', 'placeholder')

    app.call('rerun', { element: element })

    assertEqual(element.getAttribute('placeholder'), 'Search the docs')
  } finally {
    globalize.module = oldModule
    globalize.cachedData = oldCached
    globalize.storageKey = oldKey
  }
})

test('globalize-target - falls back to element content without a target', function () {
  var globalize = app.module.globalize
  var oldModule = globalize.module
  var oldCached = globalize.cachedData
  var oldKey = globalize.storageKey

  globalize.module = 'globalize'
  globalize.storageKey = 'globalize.en'
  globalize.cachedData = { data: { translations: { greeting: 'Hello' } } }

  try {
    var element = createElement('span')
    element.setAttribute('globalize-get', 'greeting')

    app.call('rerun', { element: element })

    assertEqual(element.textContent, 'Hello')
    assertEqual(element.getAttribute('placeholder'), null)
  } finally {
    globalize.module = oldModule
    globalize.cachedData = oldCached
    globalize.storageKey = oldKey
  }
})
