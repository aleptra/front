/*
    Author: Josef Gabrielsson
    Version: 0.1.1
*/

require("https://maps.googleapis.com/maps/api/js?key=AIzaSyAev1q4GNC-VlKYxWQXWfuPQ3pexINKOEY&callback=initMap&libraries=&v=weekly")

function initMap(){
  var el = dom.get("googlemaps")
      attr = el.getAttribute("googlemaps").split(",")
      latVal = attr[0].split(":")[1]
      lngVal = attr[1].split(":")[1]

  if (el)
    var googleMapsOptions = {
      zoom: 8,
      center: { lat: parseFloat(latVal), lng: parseFloat(lngVal) },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(el, googleMapsOptions)
}