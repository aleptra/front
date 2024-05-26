'use strict'

app.module.geolocalize = {

  _longitude: 0,
  _latitude: 0,

  get: function (element) {

    var run = false,
      func = 'geolocalize-get'

    if (app.await && !app.await[func]) {
      return
    } else {
      run = true
    }

    var self = this,
      id,
      target,
      options

    if (!element.getAttribute("stop")) {
      //element.setAttribute("stop", '*')
    }

    function success(pos) {
      var crd = pos.coords || []
      self._longitude = crd.longitude || 0
      self._latitude = crd.latitude || 0

      /*if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
        console.log("Congratulations, you reached the target")
        navigator.geolocation.clearWatch(id)
      }*/

      if (self._longitude && self._latitude) {
        console.error('Success:', new Date(), self._latitude, self._longitude);
        var replaceVariable = element.attributes[func].value,
          replaceValue = self._latitude + ',' + self._longitude
        app.variables.update.attributes(element, replaceVariable, replaceValue, false)
      }

      console.log(func)
      newFunction()

      navigator.geolocation.clearWatch(id)
    }

    function newFunction() {
      var elAwait = app.await[func].element
      console.log(elAwait)
      app.await[func].enable = false
      app.attributes.run([elAwait], [func, 'await'])
    }

    function error(error) {
      dom.show('#geoerror')
      var error = dom.get('#geoerror'),
        message = ''

      // Handle errors
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'User denied the request for Geolocation'
          break
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable.'
          break
        case error.TIMEOUT:
          message = 'The request to get user location timed out.'
          break
        case error.UNKNOWN_ERROR:
          message = 'An unknown error occurred.'
          break
      }

      error.textContent = message
      error.style = "color: red"

      newFunction()
    }

    target = {
      latitude: 0,
      longitude: 0,
    }

    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    }

    id = navigator.geolocation.getCurrentPosition(success, error, options)
  }
}