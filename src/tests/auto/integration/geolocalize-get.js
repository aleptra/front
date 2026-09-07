test('geolocalize-get - requests the browser position through geolocalize-get', function () {
  var options
  var element = createElement('div')
  element.setAttribute('geolocalize-get', 'location')
  app.await = app.await || {}
  app.await['geolocalize-get'] = { element: element }
  try {
    withProperty(navigator.geolocation, 'getCurrentPosition', function (success, error, value) {
      options = value
      return 7
    }, function () {
      app.call('rerun', { element: element })
    })
    assertEqual(options.maximumAge, 0)
  } finally {
    delete app.await['geolocalize-get']
  }
})
