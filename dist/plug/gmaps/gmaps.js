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
        latVal = attr[0].split(":")[1],
        lngVal = attr[1].split(":")[1]

    var location = { lat: parseFloat(latVal), lng: parseFloat(lngVal) }
    var map = new google.maps.Map(el,{
          zoom: 10,
          center: location,
        })
    var marker = new google.maps.Marker({
          position: location,
          map: map,
        })
  }
}