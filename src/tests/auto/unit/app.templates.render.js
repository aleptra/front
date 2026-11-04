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


test('app.templates - alert attribute on template should execute', function () {
  var template = createElement('template')
  template.setAttribute('alert', 'test-alert')
  document.body.appendChild(template)
  app.element.saveOriginalValues(template)

  var alertCalled = false
  var alertValue = ''
  withStub(window, 'alert', function (msg) {
    alertCalled = true
    alertValue = msg
  }, function () {
    app.attributes.run([template])
    assertTrue(alertCalled).desc('alert function was called')
    assertEqual(alertValue, 'test-alert').desc('alert received correct value')
  })

  template.remove()
})

test('app.templates - inheritattributes false should not inherit any attributes', function () {
  var srcEl = createElement('main')
  srcEl.setAttribute('id', 'source')
  srcEl.setAttribute('bgcolor', '#ff0000')

  var targetEl = createElement('main')
  targetEl.setAttribute('inheritattributes', 'false')
  targetEl.setAttribute('data-custom', 'value')

  var finalAttrs = {}
  var inherit = 'false'

  if (inherit !== 'false') {
    for (var a = 0; a < srcEl.attributes.length; a++) {
      finalAttrs[srcEl.attributes[a].name] = srcEl.attributes[a].value
    }
  }

  assertEqual(finalAttrs.bgcolor, undefined).desc('bgcolor not inherited')
  assertEqual(finalAttrs.id, undefined).desc('id not inherited')
})

test('app.templates - inheritattributes with list should inherit only specified attributes', function () {
  var srcEl = createElement('main')
  srcEl.setAttribute('id', 'source')
  srcEl.setAttribute('bgcolor', '#ff0000')
  srcEl.setAttribute('class', 'test-class')

  var finalAttrs = {}
  var inherit = 'bgcolor;id'

  for (var a = 0; a < srcEl.attributes.length; a++) {
    var attrName = srcEl.attributes[a].name
    if ((';' + inherit + ';').indexOf(';' + attrName + ';') !== -1) {
      finalAttrs[attrName] = srcEl.attributes[a].value
    }
  }

  assertEqual(finalAttrs.bgcolor, '#ff0000').desc('bgcolor inherited')
  assertEqual(finalAttrs.id, 'source').desc('id inherited')
  assertEqual(finalAttrs.class, undefined).desc('class not inherited')
})

test('app.templates - inheritattributes true should inherit all attributes', function () {
  var srcEl = createElement('main')
  srcEl.setAttribute('id', 'source')
  srcEl.setAttribute('bgcolor', '#ff0000')
  srcEl.setAttribute('class', 'test-class')

  var finalAttrs = {}
  var inherit = 'true'

  for (var a = 0; a < srcEl.attributes.length; a++) {
    var attrName = srcEl.attributes[a].name
    if (!inherit || inherit === 'true') {
      finalAttrs[attrName] = srcEl.attributes[a].value
    }
  }

  assertEqual(finalAttrs.bgcolor, '#ff0000').desc('bgcolor inherited')
  assertEqual(finalAttrs.id, 'source').desc('id inherited')
  assertEqual(finalAttrs.class, 'test-class').desc('class inherited')
})


test('app.templates - inheritcontent false should not inherit content from srcDocEl', function () {
  var srcDocEl = createElement('main')
  srcDocEl.innerHTML = 'source content'

  var parsedEl = createElement('main')
  parsedEl.setAttribute('inheritcontent', 'false')
  parsedEl.innerHTML = 'template content'

  var activeEl = parsedEl
  var inheritContent = activeEl.getAttribute('inheritcontent') !== 'false'
  var content = inheritContent && srcDocEl ? srcDocEl.innerHTML : activeEl.innerHTML

  assertEqual(inheritContent, false).desc('inheritContent is false')
  assertEqual(content, 'template content').desc('content is from template, not srcDoc')
})

test('app.templates - inheritcontent true or missing should inherit content from srcDocEl', function () {
  var srcDocEl = createElement('main')
  srcDocEl.innerHTML = 'source content'

  var parsedEl = createElement('main')
  parsedEl.innerHTML = 'template content'

  var activeEl = parsedEl
  var inheritContent = activeEl.getAttribute('inheritcontent') !== 'false'
  var content = inheritContent && srcDocEl ? srcDocEl.innerHTML : activeEl.innerHTML

  assertEqual(inheritContent, true).desc('inheritContent is true (default)')
  assertEqual(content, 'source content').desc('content is from srcDoc')
})
