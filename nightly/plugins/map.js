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
    var target = dom.get(this.config.googleTarget),
      lat = target.getAttribute(this.plugin + '-lat'),
      lng = target.getAttribute(this.plugin + '-lng')

    var mapProp = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 5,
    }
    var map = new google.maps.Map(target, mapProp)
    google.maps.event.trigger(map, 'resize')
  }
}