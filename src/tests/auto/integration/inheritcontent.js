test('inheritcontent - keeps existing content when true', function () {
  var main = app.element.select('body > main')
  if (!main) {
    main = document.createElement('main')
    document.body.appendChild(main)
  }

  main.innerHTML = 'Existing content'
  main.setAttribute('bgcolor', 'blue')

  var mockPage = '<template><main inheritcontent="true" color="red">New content</main></template>'
  var responsePage = app.parse.text(mockPage)

  app.templates.applyInlineTemplate(responsePage)

  // Content should remain unchanged (inheritcontent=true means keep existing)
  assertEqual(main.innerHTML, 'Existing content')
  // Attributes should still be applied
  assertEqual(main.getAttribute('color'), 'red')
})
