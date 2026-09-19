test('app.templates.render - should resolve bindquery in title element before setting document.title', function () {
  var titleEl = document.querySelector('title')
  var originalText = titleEl ? titleEl.textContent : ''
  var originalTitle = document.title

  if (!titleEl) {
    titleEl = document.createElement('title')
    document.head.appendChild(titleEl)
  }

  titleEl.textContent = '{app}'
  titleEl.setAttribute('bindquery', 'app:app')
  app.element.saveOriginalValues(titleEl)

  try {
    withStub(app.querystrings, 'get', function (a, key) { return key === 'app' ? 'Front' : '' }, function () {
      app.attributes.run([titleEl])
      document.title = titleEl.textContent
      assertEqual(document.title, 'Front')
    })
  } finally {
    titleEl.textContent = originalText
    document.title = originalTitle
    titleEl.removeAttribute('bindquery')
  }
})

test('app.templates.render - bindquery should resolve before globalize-get on title element', function () {
  var titleEl = document.querySelector('title') || document.createElement('title')
  if (!document.querySelector('title')) document.head.appendChild(titleEl)

  var originalText = titleEl.textContent
  var originalTitle = document.title
  titleEl.textContent = '{app}'
  titleEl.setAttribute('bindquery', 'app:app')
  titleEl.setAttribute('globalize-get', '')

  var globalize = app.module.globalize
  var oldCached = globalize.cachedData
  var oldKey = globalize.storageKey
  var oldModule = globalize.module
  globalize.module = 'globalize'
  globalize.storageKey = 'globalize.en'
  globalize.cachedData = { data: { translations: {} } }

  try {
    withStub(app.querystrings, 'get', function (a, key) { return key === 'app' ? 'Front' : '' }, function () {
      app.element.saveOriginalValues(titleEl)
      app.attributes.run([titleEl])
      assertEqual(titleEl.textContent, 'Front')
    })
  } finally {
    titleEl.textContent = originalText
    document.title = originalTitle
    titleEl.removeAttribute('bindquery')
    titleEl.removeAttribute('globalize-get')
    globalize.cachedData = oldCached
    globalize.storageKey = oldKey
    globalize.module = oldModule
  }
})
