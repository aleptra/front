test('syntaxhighlighting-set - highlights markup through syntaxhighlighting--set', function () {
  var plugin = app.plugin.syntaxhighlighting
  plugin.__autoload({ name: 'syntaxhighlighting', element: document.body })
  var element = createElement('code')
  element.innerHTML = '&lt;div&gt;hello&lt;/div&gt;'
  element.setAttribute('syntaxhighlighting--set', '')
  app.call('rerun', { element: element })
  assertTrue(element.querySelectorAll('mark').length > 0)
})
