/*
    Author: Josef Gabrielsson
    Version: 0.1.3
*/

libAttribute.push(
  {"attr": "editor", "func": "editor"}
)

function editor(el){
  var attr = el.getAttribute("editor").split(";")
  el.addEventListener('focus', editorOnFocus)
  el.addEventListener('blur', editorOnFocus)
}

function editorOnFocus(){
  window.addEventListener('keydown', editorOnKeyDown)
}

function editorOnBlur(){
  window.removeEventListener('keydown', editorOnKeyDown)
}

function editorOnKeyDown(e, el) {
  if (e.keyCode == 9) {
    e.preventDefault()
    var sel = window.getSelection()
    var range = sel.getRangeAt(0)
    console.log(range)
    var tabNodeValue = '\u0009'
    //var tabNodeValue = Array(4).join('\u00a0')
    var tabNode = document.createTextNode(tabNodeValue)
    range.insertNode(tabNode)
    range.setStartAfter(tabNode)
    range.setEndAfter(tabNode)
  }
}