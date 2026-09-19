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

test('app.templates.render - bindquery sets renderedText so subsequent attributes see resolved value', function () {
  var el = createElement('p')
  el.textContent = '{app}'
  el.setAttribute('bindquery', 'app:app')
  app.element.saveOriginalValues(el)

  withStub(app.querystrings, 'get', function (a, key) { return key === 'app' ? 'Front' : '' }, function () {
    app.attributes.run([el])
    assertEqual(el.textContent, 'Front').desc('bindquery resolved placeholder')
    assertEqual(el.renderedText, 'Front').desc('renderedText set for downstream attributes')
  })
})
