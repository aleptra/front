/*
    Author: Josef Gabrielsson
    Version: 0.1.3
*/

libAttribute.push(
  {"attr": "editor", "func": "editor"}
)

function editor(el){
  var attr = el.getAttribute("editor").split(";")
  var target = el
  alert(target)
}