'use strict'

app.plugin.map = {
  __autoload: function () {
    var key = 'AIzaSyAev1q4GNC-VlKYxWQXWfuPQ3pexINKOEY'
    var script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=maps,marker&v=beta&key='+ key +'&loading=async&callback=window.app.plugin.map.initMap'
    script.defer = true
    document.head.appendChild(script)
  },

  initMap: function () {
    var mapProp = {
      center: new google.maps.LatLng(51.508742, -0.120850),
      zoom: 5,
    }
    var map = new google.maps.Map(dom.get('#map'), mapProp)
    google.maps.event.trigger(map, 'resize')
  }
}