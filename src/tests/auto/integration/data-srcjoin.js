test('data-srcjoin - requests the joined source in addition to data-src', function () {
  var data = app.module.data
  var element = createElement('div')
  var joins = []

  element.setAttribute('data-src', '/primary.json')
  element.setAttribute('data-srcjoin', '/secondary.json')

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(data, '_handle', function (target, join) { joins.push(!!join) }, function () {
      data.src(element)
    })
  })

  assertEqual(joins.length, 2)
  assertFalse(joins[0])
  assertTrue(joins[1])
})

test('data-srcjoin - uses its own attribute and a separate cache key', function () {
  var data = app.module.data
  var element = createElement('div')

  element.setAttribute('data-src', '/primary.json')
  element.setAttribute('data-srcjoin', '/secondary.json')

  var primary = data._sourceOptions(element)
  var joined = data._sourceOptions(element, true)

  assertEqual(primary.attribute, 'data-src')
  assertEqual(joined.attribute, 'data-srcjoin')
  assertEqual(joined.storageKey, primary.storageKey + 'join')
})
