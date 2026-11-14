test('inheritattributes - applies template attributes to target element', function () {
  var main = app.element.select('body > main')
  if (!main) {
    main = document.createElement('main')
    document.body.appendChild(main)
  }

  // Set initial attributes
  main.setAttribute('bgcolor', 'blue')
  main.setAttribute('color', 'red')

  // Create mock response page with template
  var mockPage = '<template><main inheritattributes="bgcolor" data-test="value"></main></template>'
  var responsePage = app.parse.text(mockPage)

  // Apply inline template (without running attributes to avoid loops)
  var templateElement = app.element.find(responsePage, 'template')
  if (templateElement) {
    var templateContent = app.parse.text(templateElement.innerHTML)
    var templateEl = app.templates.resolveSection(templateContent, 'main')
    app.templates.applyAttributes(templateEl, main)
  }

  // Should preserve bgcolor, but add data-test
  assertEqual(main.getAttribute('bgcolor'), 'blue')
  assertEqual(main.getAttribute('data-test'), 'value')
  // color should be removed (not in inherit list)
  assertEqual(main.getAttribute('color'), null)
})

test('inheritattributes - false clears all attributes', function () {
  var main = app.element.select('body > main')
  if (!main) {
    main = document.createElement('main')
    document.body.appendChild(main)
  }

  main.setAttribute('bgcolor', 'blue')
  main.setAttribute('color', 'red')

  var mockPage = '<template><main inheritattributes="false" newattr="value"></main></template>'
  var responsePage = app.parse.text(mockPage)

  var templateElement = app.element.find(responsePage, 'template')
  if (templateElement) {
    var templateContent = app.parse.text(templateElement.innerHTML)
    var templateEl = app.templates.resolveSection(templateContent, 'main')
    app.templates.applyAttributes(templateEl, main)
  }

  // All old attributes should be cleared
  assertEqual(main.getAttribute('bgcolor'), null)
  assertEqual(main.getAttribute('color'), null)
  // Only new attribute should exist
  assertEqual(main.getAttribute('newattr'), 'value')
})
