/*
    Author: Josef Gabrielsson
    Version: 0.1.2
*/

require("https://maps.googleapis.com/maps/api/js?key=AIzaSyAev1q4GNC-VlKYxWQXWfuPQ3pexINKOEY")

libAttribute.push(
  {"attr": "googlemaps", "func": "googlemaps"}
)

function googlemaps(){
  var el = dom.get("googlemaps")
  if(el){
    var attr = el.getAttribute("googlemaps").split(",")
        latVal = attr[0].split(":")[1],
        lngVal = attr[1].split(":")[1]

    var googleMapsOptions = {
      zoom: 8,
      center: { lat: parseFloat(latVal), lng: parseFloat(lngVal) },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(el, googleMapsOptions)
  }
}