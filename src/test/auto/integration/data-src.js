test('data-src - schedules a source request through data-src', function () {
  var handled
  var data = app.module.data
  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(data, '_handle', function (element) { handled = element }, function () {
      var element = createElement('div')
      element.setAttribute('data-src', '/items.json')
      element.setAttribute('data-wait', '0')
      app.call('rerun', { element: element })
      assertEqual(handled, element)
    })
  })
})
