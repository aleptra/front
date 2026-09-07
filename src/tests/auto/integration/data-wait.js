test('data-wait - delays the source request by the configured interval', function () {
  var data = app.module.data
  var element = createElement('div')
  var delay

  element.setAttribute('data-src', '/items.json')
  element.setAttribute('data-wait', '50')

  withStub(app, 'wait', function (value) { delay = value }, function () {
    data.src(element)
  })

  assertEqual(delay, '50')
})

test('data-wait - falls back to the module default interval', function () {
  var data = app.module.data
  var element = createElement('div')
  var delay

  element.setAttribute('data-src', '/items-default.json')

  withStub(app, 'wait', function (value) { delay = value }, function () {
    data.src(element)
  })

  assertEqual(delay, data.defaultInterval)
})
