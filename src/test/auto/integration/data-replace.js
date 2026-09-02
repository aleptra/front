test('data-replace - rewrites matching values in the response', function () {
  if (!app.module.data) return

  var data = app.module.data
  var element = createElement('div')
  var response = {
    data: {
      results: [
        { media_type: 'tv', title: 'Series' },
        { media_type: 'movie', title: 'Film' }
      ]
    },
    status: 200
  }

  element.setAttribute('data-src', '/replace-items.json')
  element.setAttribute('data-replace', 'media_type')
  app.element.saveOriginalValues(element)

  withStub(data, '_traverse', function () { }, function () {
    data._run({ storageKey: 'data-replace-key', iterate: 'results', element: element }, response)
  })

  assertEqual(response.data.results[0].media_type, 'show')
  assertEqual(response.data.results[1].media_type, 'movie')
})
