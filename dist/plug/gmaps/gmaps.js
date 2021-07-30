/*
    Author: Josef Gabrielsson
    Version: 0.1.3
*/

libAttribute.push(
  {"attr": "gmaps", "func": "gmaps"}
)

require("https://maps.googleapis.com/maps/api/js?key=AIzaSyAev1q4GNC-VlKYxWQXWfuPQ3pexINKOEY")

function gmaps(){
  var el = dom.get("gmaps")
  if(el){
    var attr = el.getAttribute("gmaps").split(",")
        latVal = parseFloat(attr[0].split(":")[1]) || 0,
        lngVal = parseFloat(attr[1].split(":")[1]) || 0

    var location = { lat: latVal, lng: lngVal }
    var map = new google.maps.Map(el,{
          zoom: 15,
          center: location,
        })
    var marker = new google.maps.Marker({
          position: location,
          map: map,
        })
  }
}