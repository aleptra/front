test('readingtime-set - calculates reading time through readingtime--set', function () {
  var plugin = app.plugin.readingtime
  plugin.__autoload({ name: 'readingtime', element: document.body })
  var article = createElement('article')
  article.id = 'attribute-reading'
  var words = []
  for (var i = 0; i < 400; i++) words.push('word')
  article.textContent = words.join(' ')
  var output = createElement('span')
  output.setAttribute('readingtime--set', '#attribute-reading')
  app.call('rerun', { element: output })
  assertEqual(output.textContent, '2 min to read')
})
