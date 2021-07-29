/*
    Author: Josef Gabrielsson
    Version: 0.1.2
*/

libAttribute.push(
  {"attr": "googlemaps", "func": "googlemaps"}
)

require("https://maps.googleapis.com/maps/api/js?key=AIzaSyAev1q4GNC-VlKYxWQXWfuPQ3pexINKOEY")

function googlemaps(){
  var el = dom.get("googlemaps")
  if(el){
    var attr = el.getAttribute("googlemaps").split(",")
        latVal = attr[0].split(":")[1],
        lngVal = attr[1].split(":")[1]

    var location = { lat: -25.344, lng: 131.036 }
    var map = new google.maps.Map(el,{
          zoom: 4,
          center: location,
        })
    /*var marker = new google.maps.Marker({
          position: location,
          map: map,
        })*/
  }
}