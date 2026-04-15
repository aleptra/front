'use strict'

app.plugin.map = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(
      this.plugin,
      {
        googleKey: '',
        googleTarget: '',
        bingKey: '',
        bingTarget: '',
        osmKey: '',
        osmTarget: '',
      },
      options.element
    )

    var script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=maps,marker&key=' + this.config.googleKey + '&loading=async&callback=window.app.plugin.map._initMap'
    script.defer = true
    document.head.appendChild(script)
  },

  _initMap: function () {
    if (this._pendingTarget) {
      this._render(this._pendingTarget, this._pendingLat, this._pendingLng)
      this._pendingTarget = null
    }
  },

  run: function (object, value) {
    var target = app.element.resolveCall(object, value)
    var lat = target.getAttribute(this.plugin + '-lat'),
      lng = target.getAttribute(this.plugin + '-lng')

    if (typeof google !== 'undefined' && google.maps) {
      this._render(target, lat, lng)
    } else {
      this._pendingTarget = target
      this._pendingLat = lat
      this._pendingLng = lng
    }
  },

  _render: function (target, lat, lng) {
    var center = { lat: parseFloat(lat), lng: parseFloat(lng) },
      mapProp = {
        center: center,
        zoom: 15,
        mapId: 'default'
      }
    var map = new google.maps.Map(target, mapProp)
    new google.maps.marker.AdvancedMarkerElement({
      position: center,
      map: map
    })
    google.maps.event.trigger(map, 'resize')
  }
}
