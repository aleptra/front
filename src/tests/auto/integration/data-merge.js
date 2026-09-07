test('data-merge - copies the named keys from the joined response', function () {
  if (!app.module.data) return

  var data = app.module.data
  var merged = data._merge(
    { data: { items: ['a'], extra: 'original' }, status: 200 },
    { data: { extra: 'joined', unused: 'ignored' } },
    'extra'
  )

  assertEqual(merged.data.extra, 'joined')
  assertEqual(merged.data.items.length, 1)
  assertEqual(merged.data.unused, undefined)
  assertEqual(merged.status, 200)
})

test('data-merge - merges the joined cache into the rendered response', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var rendered

  element.setAttribute('data-src', '/merge-primary.json')
  element.setAttribute('data-srcjoin', '/merge-secondary.json')
  element.setAttribute('data-merge', 'authors')
  app.element.saveOriginalValues(element)

  withStub(app.caches, 'get', function (mechanism, type, key) {
    return key.indexOf('join') !== -1 ? { data: { authors: ['Joined author'] } } : null
  }, function () {
    withStub(data, '_traverse', function (options, response) { rendered = response }, function () {
      data._run(
        { storageKey: 'data-merge-key', iterate: 'items', element: element },
        { data: { items: ['Item'], authors: ['Original author'] }, status: 200 }
      )
    })
  })

  assertEqual(rendered.data.authors[0], 'Joined author')
  assertEqual(rendered.data.items[0], 'Item')
})
