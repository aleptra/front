test('scrollbar-set - creates scoped scrollbar styles through scrollbar--set', function () {
  var plugin = app.plugin.scrollbar
  plugin.__autoload({ name: 'scrollbar', element: document.body })
  var element = createElement('div')
  element.setAttribute('scrollbar--set', 'width:auto;radius:8')
  app.call('rerun', { element: element })
  var styleId = 'scrollbar-style-' + element.getAttribute('data-scrollbar-id')
  var style = document.getElementById(styleId)
  assertTrue(!!style)
  assertContains(style.textContent, '14px')
  style.remove()
})
