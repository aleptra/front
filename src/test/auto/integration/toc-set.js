test('toc-set - creates nested links for article headings', function () {
  var plugin = app.plugin.toc
  plugin.__autoload({ name: 'toc', element: document.body })

  var article = createElement('article')
  var nav = document.createElement('nav')
  nav.setAttribute('toc--set', '')
  article.appendChild(nav)

  var title = document.createElement('h1')
  title.textContent = 'Attributes'
  article.appendChild(title)

  var layers = document.createElement('h2')
  layers.textContent = 'Attribute Layers'
  article.appendChild(layers)

  var execution = document.createElement('h3')
  execution.textContent = 'Execution order'
  article.appendChild(execution)

  var values = document.createElement('h2')
  values.textContent = 'Attribute Values'
  article.appendChild(values)

  var duplicate = document.createElement('h2')
  duplicate.textContent = 'Attribute Values'
  article.appendChild(duplicate)

  var excluded = document.createElement('h2')
  excluded.setAttribute('toc--exclude', '')
  excluded.textContent = 'Internal Notes'
  article.appendChild(excluded)

  app.call('rerun', { element: nav })

  var links = nav.querySelectorAll('a[data-toc-generated="true"]')
  assertEqual(links.length, 5)
  assertEqual(nav.querySelectorAll('ol').length, 0)
  assertEqual(nav.querySelectorAll('li').length, 0)
  assertEqual(title.id, 'attributes')
  assertEqual(links[0].getAttribute('href'), '#attributes')
  assertEqual(links[0].textContent, 'Attributes')
  assertEqual(duplicate.id, 'attribute-values-2')
  assertEqual(excluded.id, '')
  assertEqual(nav.textContent.indexOf('Internal Notes'), -1)

  app.call('rerun', { element: nav })
  assertEqual(nav.querySelectorAll('a[data-toc-generated="true"]').length, 5)
})
