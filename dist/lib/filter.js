libAttribute.push({
  "attr": "filter",
  "func": "bindFilter"
})

var target

function bindFilter(el) {
  target = el
}

function filter() {
  var e = event && (event.target || event.srcElement)
  var filter = e.value.toUpperCase()

  var children = target.getElementsByTagName('*')
  for (var i = 0; i < children.length; i++) {
    if (children[i].hasAttribute("filteron")) {
      var filteron = children[i].getAttribute("filteron")
      if (filteron.toUpperCase().indexOf(filter) > -1)
        children[i].style.display = ""
      else
        children[i].style.display = "none"
    }
  }
}