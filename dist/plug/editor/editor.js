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
  var sel = window.getSelection()
  var range = sel.getRangeAt(0)
  if (e.keyCode == 9) {
    var tabNodeValue = '\u0009'
    //var tabNodeValue = Array(4).join('\u00a0')
    var tabNode = document.createTextNode(tabNodeValue)
    range.insertNode(tabNode)
    range.setStartAfter(tabNode)
    range.setEndAfter(tabNode)
  } else if (e.keyCode == 13) {
    range.setStart(sel)
  } else {
    return
  }

  console.log(e.target)
  core.runAttributesInElement(e.target)
  e.preventDefault()
}

function editorPreview() {
  var code = dom.get('code?tag=0')
  var x = dom.get('iframe?tag=0')
  var y = (x.contentWindow || x.contentDocument)
  if (y.document)y = y.document
  y.body.innerHTML = code.innerText
}