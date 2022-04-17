libAttribute.push({
  "attr": "navigate",
  "func": "nav"
})

var navTargetEl = "main?tag"
var hash = location.hash
var historyStack = []

window.addEventListener("popstate", function (e) {
  if (location.href.indexOf('#') !== -1)
    return false
  else if (window.history && window.history.pushState)
    return nav(e.target.location.pathname, false, false)
  else
    self.location.href = currentEnvUrl
})

function nav(path, el, push) {
  var path = (currentEnvUrl === path || path === currentEnvUrl + "./") ? startPage : path
  var target = (el === undefined || el === false) ? navTargetEl : el
  var contentOrginal = dom.content(target)
  var anchor = (path) ? path.split("#") : ""
  client.addHeader("Path", path)
  client.addHeader("Cache-Control", "must-revalidate")
  client.get(path, function (response, status) {
    if (status == 200) {
      if (push || path == startPage) navPush(path)
      dom.content(target, response)
      if (!dom.get("title?tag=1")) document.title = title
      //core.initCoreVariables(target)

      if (anchor[1]) {
        dom.scrollInto(anchor[1])
      } else {
        dom.scrollInto(target, true)
      }

      var array = dom.getChildren("template?tag");
      for (var i = 0; i < array.length; i++) {
        core.runAttributesInElement(array[i])
      }

      core.runAttributesInElement(target)
    }
  })

  loadTemplate = false
  return false
}

function navPush(url) {
  var url = url.replace(startPage, "./")
  var title = dom.get("title?tag").textContent
  var stateObj = {
    path: url
  }
  var historyStackLast = historyStack.length - 1

  if (historyStack[historyStackLast] !== url) {
    historyStack.push(url)
    history.pushState(stateObj, title, url)
  }
}