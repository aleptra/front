var html,
  front,
  frontVariables = [],
  frontEnums = [],
  libAttribute = [],
  libPreload = [],
  listenEls = [],
  bindEls = [],
  xhrProgress,
  appStorage,
  load = false,
  loadTemplate = false,
  loadStorage = false,
  debugMode = false,
  isMobile = false,

  urlDelimiter = "/",
  elementDivider = /[?=]/,
  bindDivider = ".",
  varDivider = ":",

  hostName,
  url,
  title,
  currentUrl,
  currentPage,
  currentScriptUrl,
  currentEnvName,
  currentEnvUrl,
  referrerUrl,
  baseUrl,
  html,
  startPage = "home.html",

  pathLib = "lib",
  pathPlug = "plug",
  pathFont = "font"

document.addEventListener("DOMContentLoaded", function () {
  html = document.documentElement
  title = document.title
  front = document.getElementsByTagName("*")
  debugMode = html.getAttribute("debug")
  startPage = (html.hasAttribute("startpage")) ? html.getAttribute("startpage") : startPage
  hostName = window.location.hostname
  url = window.location.origin + urlDelimiter
  currentUrl = window.location.href
  currentPage = window.location.pathname
  baseUrl = app.getBaseUrl(currentUrl)
  environments = app.getCurrentEnvironment()
  currentEnvName = environments[0]
  currentEnvUrl = environments[1]
  currentScript = document.querySelector('script[src*="front.js"]')
  currentScriptUrl = currentScript.getAttribute("src")
  referrerUrl = document.referrer
  isMobile = "ontouchstart" in window && window.screen.availWidth < 768

  if (currentEnvName == "local") {
    app.runDevFile()
  }

  var main = dom.get("main?tag=0"),
    trigger = false
  if (main) main.addEventListener("scroll", function (e) {
    x = e.target.scrollLeft
    y = e.target.scrollTop

    if (listenEls.length > 0) {
      var el = dom.get(listenEls[0]),
        attr = el.getAttribute("scrolltoggle").split(";"),
        attrX = attr[0],
        attrY = attr[1]
      if ((x >= attrX && y >= attrY) && !trigger) {
        dom.hide(el)
        trigger = true
      }
      if (y <= 0) {
        dom.show(el)
        trigger = false
      }
    }
  })

  if (currentScript.hasAttribute("store")) {
    var attr = currentScript.getAttribute("store").split(";")
    for (storefile in attr) {
      var file = attr[storefile].split(varDivider),
        storeXhr = new xhr()
      storeXhr.addHeader("storeName", file[1])
      storeXhr.get(currentEnvUrl + file[0] + ".json", function (response, status, headers) {
        appStorage = response
        app.storage(headers[0][1], response)
      })
    }

    loadStorage = true
  }

  if (!core.hasTemplateLayout()) {
    currentScriptUrl = app.getBaseUrl(currentScriptUrl)
    if (currentScript.hasAttribute(pathLib)) {
      var libs = currentScript.getAttribute(pathLib).split(";")
      for (lib in libs)
        app.require(libs[lib], pathLib)
    }

    if (currentScript.hasAttribute(pathPlug)) {
      var plugs = currentScript.getAttribute(pathPlug).split(";")
      for (plug in plugs)
        app.require(plugs[plug], pathPlug)
    }

    if (currentScript.hasAttribute(pathFont)) {
      var fonts = currentScript.getAttribute(pathFont).split(";")
      for (font in fonts) {
        var val = fonts[font].split(":")
        fName = val[1]
        path = val[0]
        newEl = document.createElement('style')
        newEl.appendChild(document.createTextNode('@font-face{font-family:' + fName + '; src:url(' + path + ')}'))
        document.body.appendChild(newEl)
      }
    }

    loadTemplate = false
  }

  document.onkeyup = function (e) {
    if (e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA" || e.target.isContentEditable) return false
    var key = String.fromCharCode(e.keyCode)
    for (i = 0; i < front.length; i++) {
      if (front[i].hasAttribute("key"))
        if (front[i].getAttribute("key") == key)
          var action = front[i].getAttribute("keyaction")
      eval("front[i]." + action)
    }
  }

  document.onclick = function (e) {
    var clicked = (e.target) ? e.target : e.srcElement

    if (clicked.parentNode && clicked.parentNode.getAttribute("selective")) {
      for (j = 0; j < clicked.parentNode.childElementCount; j++) {
        dom.class(clicked.parentNode.children[j], "remove", "sel")
      }
      dom.class(clicked, "add", "sel")
    }

    var el = getParentTag(clicked, "a")
    if (el !== null) {
      var elHref = el.getAttribute("href"),
        elTarget = el.getAttribute("target")
      if (el.hasAttribute("window")) {
        dom.create("div", ["href=/"], "head")
        return false
      } else if (elHref && elHref.substring(0, 1) === "#") {
        location.hash = elHref
        return false
      } else if (elHref && elHref.substring(0, 11) !== "javascript:" && elTarget !== "_top" && elTarget !== "_blank") {
        app.debug('Click (Ajax): ' + elHref)
        if (window.location.hash) location.hash = ""
        if (core.isLibLoaded('nav')) return nav(currentEnvUrl + elHref, false, true)
      } else {
        app.debug('Click')
      }
    }
  }

  document.addEventListener("click", function (e) {
    var clicked = (e.target) ? e.target : e.srcElement,
      val = clicked.parentNode.getAttribute("onclick")
    if (val) {
      core.runFunction("dom." + val, clicked.parentNode)
      e.stopPropagation()
    }
    return false
  }, true)

  xhrProgress = dom.get("navprogress")
})

window.onerror = function (msg, url, line) {
  dom.create('div', ['id=fronterror', 'className=alert pf b1 l1 bcred white snack', 'innerHTML=' + msg + "<br>" + " at " + url + ":" + line], 'footer')
}

window.addEventListener("load", function () {
  core.runLibPreloads()
  core.runFrontAttributes()
})

window.addEventListener("hashchange", function () {
  return false
}, false)

function set(type, param, value) {
  dom.set(type, param, value)
}

function getParentTag(element, tag) {
  while (element !== null) {
    if (element.tagName && element.tagName.toLowerCase() === tag) {
      return element
    }
    element = element.parentNode
  }
  return null
}

function getObject(obj, name) {
  var objarr = "obj." + name
  try {
    var obj = eval(objarr)
    return obj
  } catch (err) {
    return false
  }
}

function mergeObject(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

var core = function () {
  this.runLibPreloads = function () {
    for (i = 0; i < libPreload.length; i++) {
      if (libPreload[i].func)
        window[libPreload[i].func]()
    }
  }

  this.runFrontAttributes = function () {
    for (i = 0; i < front.length; i++) {
      this.runCoreAttributes(front[i])
      this.runLibAttributes(front[i])
    }
  }

  this.runAttributesInElement = function (e) {
    this.runCoreAttributesInElement(e)
    this.runLibAttributesInElement(e)
  }

  this.isLibLoaded = function (name) {
    return (typeof window[name] === 'function')
  }

  this.hasTemplateLayout = function () {
    for (i = 0; i < front.length; i++) {
      if (front[i].hasAttribute("template") && front[i].tagName == "SCRIPT") {
        var template = front[i].getAttribute("template").split(";"),
          template1 = template[0] === "true" ? "index" : template[0],
          template2 = template[1] ? template[1] : false

        var cUrl = (currentScriptUrl.indexOf("http") >= 0) ? currentUrl : currentScriptUrl,
          count = cUrl.split("../").length + (template1.match(/..\//g) || []).length,
          url = currentUrl.split("/").slice(0, -count).join("/")

        var html = dom.get("html?tag=0"),
          script = dom.get("script?tag=0"),
          del = document.documentElement
        script.removeAttribute("src")
        script.removeAttribute("template")
        del.parentNode.removeChild(del)

        var main = dom.removeTags(html.outerHTML, ["html", "head", "script", "body"])

        function getTwoTemplates() {
          var xhr = new XMLHttpRequest()
          xhr.onload = function () {
            var response = this.responseText.match(/<template[^>]*>([\s\S]*?)<\/template>/gm)
            getOneTemplate(response)
          }
          xhr.open("GET", url + "/" + template2 + ".html", false)
          xhr.send()
        }

        function getOneTemplate(response2) {
          var xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              response = this.responseText
              response = response.replace(/<base(.*)>/gi, '<base$1 href="' + url + '/">')
              response = response.replace(/<main(.*) include="(.*)">/gi, '<main$1>' + main + response2)
              document.open()
              document.write(response)
              document.close()
            }
          }
          xhr.open("GET", url + "/" + template1 + ".html", false)
          xhr.send()
        }

        if (template2)
          getTwoTemplates()
        else
          getOneTemplate("")

        return true
      }
    }

    this.runFunction = function (fnc, arg) {
      eval(fnc)(arg)
    }

    this.runListener = function (e) {
      var listener = e.getAttribute("eventlistener"),
        action = e.getAttribute("eventaction")
      window.addEventListener(listener, function () {
        eval(action)
      })
    }
  }

  this.runCoreAttributes = function (e) {
    if (e.tagName == "BASE" && e.hasAttribute("env")) {
      dom.update("base?tag", ["setAttribute", "href", currentEnvUrl])
      app.debug("Environment: " + currentEnvName, "blue")
    }
    if (e.hasAttribute("run") && e.getAttribute("run") === "false")
      dom.enable(e, false)
    if (e.hasAttribute("include"))
      core.includeFile(e)
    if (e.hasAttribute("storage")) {
      var attr = e.getAttribute("storage").split(";"),
        strObject = ""
      for (i in attr) {
        strObject += app.storage(attr[i]) || ''
      }
      var mergedObject = core.mergeObject(strObject)
      var elHtml = e.innerHTML
      e.innerHTML = elHtml.replace(/{{\s*storage\s*:\s*(.*?)\s*}}/gi, function (x) {
        var data = "",
          variable = x.replace(/{{(.*):(.*)(.*?)(.*)}}/gi, "$2")
        try {
          data = JSON.parse(mergedObject)
          return eval("data." + variable)
        } catch (err) {
          dom.get("main?tag=0").insertAdjacentHTML('beforeend', err + "<hr>" + variable + "<hr><b>mergedObject:</b> " + mergedObject + "<hr><b>StrObject:</b> " + strObject + "<hr><b>App Storage:</b>" + appStorage + "<hr><b>LoadStorage:</b>" + loadStorage)
        }
      })
    }
    if (e.hasAttribute("enum")) {
      var enums = e.getAttribute("enum")
      test = enums.split(";")
      for (i in test) {
        v = test[i].split(":")
        frontEnums[v[0]] = v[1]
      }
    }
    if (e.tagName == "TITLE" && e.parentNode.tagName !== "HEAD") {
      document.title = e.text
    }
    if (e.hasAttribute("cache")) {
      var value = e.getAttribute("cache")
      if (value == "no") {
        dom.create("meta", ["httpEquiv=Cache-Control", "content=no-cache,no-store,must-revalidate"], "head")
        dom.create("meta", ["httpEquiv=Pragma", "content=no-cache"], "head")
        dom.create("meta", ["httpEquiv=Expires", "content=0"], "head")
      }
    }
    if (e.hasAttribute("eventlistener"))
      core.runListener(e)
    if (e.tagName == "TEMPLATE" && !loadTemplate) {
      var template1 = core.toArray(dom.getChildren("template?tag=0")),
        template2 = core.toArray(dom.getChildren("template?tag=1")),
        sorted1 = core.sortArray(template1, "tagName"),
        sorted2 = core.sortArray(template2, "tagName"),
        array = core.tagArray(sorted1),
        array2 = core.tagArray(sorted2)

      for (var i in array) {
        var el = array[i].tagName + "?tag=" + array[i].tagIndex,
          index = array[i].getAttribute("index"),
          inherit = array[i].getAttribute("inherit")

        if (array[i].tagIndex == index && !inherit)
          dom.content(el, array[i].innerHTML)
        if (array2[i] && inherit)
          dom.content(el, array2[i].innerHTML)
      }

      loadTemplate = true
    }
    if (e.hasAttribute("resizable"))
      e.style.resize = "both"
    if (e.hasAttribute("fixed"))
      e.style.position = "fixed"
    if (e.hasAttribute("alert"))
      alert(e.getAttribute("alert"))
    if (e.hasAttribute("onload"))
      eval(e.getAttribute("onload"))
    if (e.hasAttribute("var") || e.hasAttribute("variable")) {
      var attr = e.getAttribute("var") || e.getAttribute("variable"),
        res = attr.split(varDivider)
      frontVariables[res[0].toLowerCase()] = res[1]
    }
    if (e.tagName == "VAR") {
      var variable = frontVariables[e.innerHTML.toLowerCase()]
      if (variable) e.innerHTML = variable
    }
    if (e.hasAttribute("property") && e.hasAttribute("content")) {

      var attr = e.getAttribute("content")
      //var increment = attr.split(";")
      //attr.innerText = ""

      //var increment = (variables) ? el.getAttribute("variable").split(";")[1] : 0
      test = attr.replace(/{{ (.*?) }}/ig, "$1")
      var test2 = test.split(";")
      try {
        e.content = eval(test2[1])
      } catch (err) {}

    }
    if (e.innerHTML.match("{%(.*?)%}")) {
      e.innerHTML = e.innerHTML.replace(new RegExp("{%(.*?)%}", "gi"), function (out1, out2) {
        var input = eval(out2),
          isMod = (out1.indexOf("=") > 0) ? true : false
        return core.callAttributes(input, input + out2, isMod)
      })
    }
    if (e.hasAttribute("metacontent")) {
      var value = e.getAttribute("metacontent")
      var els = document.getElementsByTagName("meta")
      for (var i in els) {
        if (typeof (els[i].name) != "undefined" && els[i].name.toLowerCase() == value)
          e.innerHTML = els[i].content
      }
    }
    if (e.hasAttribute("bind")) {
      var attr = e.getAttribute("bind").split(":"),
        target = attr[0],
        value = attr[1],
        type = e.type,
        targetEl = dom.get(target)

      if (type == "text") {
        var key = e.getAttribute("bindkey") || 13
        e.onkeyup = function (input) {
          if (input.keyCode === key || key === "true")
            if (e.hasAttribute("bindinclude"))
              core.includeBindFile(e, input.target.value, target, value)
          else
            dom.bind(targetEl, value, input.target.value)
        }
      } else if (type == "checkbox" || type == "radio") {

        e.onclick = function (input) {
          if (value.split("|")) {
            var values = value.split("|"),
              newValue = (values[0] == input.target.value) ? values[1] : values[0],
              newCheckedValue = (newValue === "true") ? true : false
            targetEl.setAttribute("checked", newCheckedValue)
            targetEl.value = newValue
            targetEl.checked = newCheckedValue
          } else {
            return dom.bind(targetEl, value, input.target.value)
          }
        }

      } else if (type == "select") {
        console.log("select")
      } else {
        var bindvalue = (e.hasAttribute("bindvalue")) ? e.getAttribute("bindvalue") : value
        dom.bind(targetEl, value, bindvalue)
      }
    }
    if (e.hasAttribute("iterate") && e.hasAttribute("datasource") === false)
      core.runIteration(e)
    if (e.hasAttribute("trim"))
      e.innerHTML = core.trim(e.innerHTML)
    if (e.hasAttribute("lowercase"))
      e.innerHTML = core.toLower(e.innerHTML)
    if (e.hasAttribute("uppercase"))
      e.innerHTML = core.toUpper(e.innerHTML)
    if (e.hasAttribute("escape")) {
      var escape = e.innerHTML
      var code = escape.charCodeAt(0)

      if (0xD800 <= code && code <= 0xDBFF) {
        low = escape.charCodeAt(1)
        code = ((code - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
      }

      if (code) e.innerText = "&#" + code + ";"
    }
    if (e.hasAttribute("format")) {
      var content = e.innerText
      var format = e.getAttribute("format")
      if (content.length == 8 && core.isNumber(content)) content = content.replace(/^(\d{4})/, '$1-').replace(/-(\d{2})/, '-$1-')
      var value = new Date(content)

      if (format == "age") {
        e.innerHTML = ~~((Date.now() - value.getTime()) / (31557600000))
      } else {
        var match = format.match(/\((.*)\)/gi)
        var res = match[0].slice(1, -1)
        e.innerHTML = res.replace(/Y/gi, value.getFullYear())
          .replace(/M/gi, ("0" + (value.getMonth() + 1)).substr(-2))
          .replace(/D/gi, ("0" + value.getDate()).substr(-2))
          .replace(/H/gi, ("0" + value.getHours()).substr(-2))
          .replace(/I/gi, ("0" + value.getMinutes()).substr(-2))
          .replace(/S/gi, ("0" + value.getSeconds()).substr(-2))
      }
    }
    if (e.hasAttribute("fixedpoint")) {
      var val = e.getAttribute("fixedpoint")
      e.innerHTML = parseFloat(e.innerHTML).toFixed(val)
    }
    if (e.hasAttribute("decode")) {
      var decode = e.getAttribute("decode")
      e.innerHTML = ""
    }
    if (e.hasAttribute("delimiter")) {
      var delimiter = e.getAttribute("delimiter")
      document.styleSheets[0].insertRule("nav.delimiter * a:after {content: '\\00a0 \\00a0" + delimiter + "\\00a0 \\00a0' !important}", 0)
    }
    if (e.hasAttribute("slice")) {
      var slice = e.getAttribute("slice").replace(/\s+/g, "")
      var res = slice.split(",")
      e.innerHTML = e.innerHTML.slice(res[0], res[1])
    }
    if (e.hasAttribute("beforebegin"))
      e.insertAdjacentText("beforebegin", e.getAttribute("beforebegin"))
    if (e.hasAttribute("beforeend"))
      e.insertAdjacentText("beforeend", e.getAttribute("beforeend"))
    if (e.hasAttribute("afterend"))
      e.insertAdjacentText("afterend", e.getAttribute("afterend"))
    if (e.hasAttribute("afterbegin"))
      e.insertAdjacentText("afterbegin", e.getAttribute("afterbegin"))
    if (e.hasAttribute("if")) {
      var val = e.getAttribute("if")
      var ifnot = (val.substr(0, 1) == "!") ? true : false
      val = val.replace(/!/g, "")

      if (val.substr(0, 2) !== "{{") {
        var term = val.split(";")
        var action = term[2].split(/:(.*)/)

        if (!ifnot && term[0] == term[1])
          e.setAttribute(action[0], action[1])
        if (ifnot && term[0].length > 0)
          e.setAttribute(action[0], action[1])
      }
    }
    if (e.hasAttribute("hide") || e.hasAttribute("skip"))
      e.style.display = "none"
    if (e.hasAttribute("content") && e.tagName !== "META") {
      var val = e.getAttribute("content").split(":")
      var content = front.namedItem(val[0]).innerHTML
      var set = (val[1] == "false") ? dom.escape(content) : content
      e.innerHTML = set
    }
    if (e.hasAttribute("scrolltoggle"))
      listenEls.push(e)
    if (e.hasAttribute("bindvalue")) {
      var attr = e.getAttribute("bind").split(":"),
        target = attr[1],
        value = e.getAttribute("bindvalue"),
        el = dom.get(target)
      bindEls.push({
        value: value,
        target: target,
        el: el,
        e: e
      })
    }
    if (e.tagName == "CODE") {
      //this.runCoreAttributesInElement(e)
    }
    if (e.hasAttribute("background")) {
      var val = e.getAttribute("background")
      if (val.indexOf(".")) e.style.backgroundImage = "url('" + val + "')";
      else e.style.backgroundColor = val
    }
    if (e.hasAttribute("focus"))
      dom.focus(e)
    if (e.hasAttribute("font"))
      e.style.fontFamily = e.getAttribute("font")
  }

  this.initCoreVariables = function (e) {
    var target = (e) ? dom.get(e) : html
    target.innerHTML = target.innerHTML.replace(new RegExp("{%(.*?)%}", "gi"), function (out1, out2) {
      var input = eval(out2)
      var isMod = (out1.indexOf("=") > 0) ? true : false
      return core.callAttributes(input, input + out2, isMod)
    })
  }

  this.runCoreAttributesInElement = function (e) {
    var e = (typeof e === "string") ? dom.get(e) : e
    els = e.getElementsByTagName("*")
    for (i = 0; i < els.length; i++) {
      core.runCoreAttributes(els[i])
    }
  }

  this.runLibAttributesInElement = function (e) {
    var e = (typeof e === "string") ? dom.get(e) : e
    els = e.getElementsByTagName("*")
    for (k = 0; k < els.length; k++) {
      for (j = 0; j < libAttribute.length; j++) {
        if (els[k].hasAttribute(libAttribute[j].attr)) {
          window[libAttribute[j].func](els[k])
        }
      }
    }
  }

  this.runLibAttributes = function (e) {
    var e = (typeof e === "string") ? dom.get(e) : e
    for (j = 0; j < libAttribute.length; j++) {
      if (e.getAttribute(libAttribute[j].attr)) {
        window[libAttribute[j].func](e)
      }
    }
  }

  this.rerunLibAttributes = function (attr) {
    for (i = 0; i < front.length; i++)
      if (front[i].getAttribute(attr))
        window[attr](front[i])
  }

  this.runIteration = function (element, start, stop) {
    var attribute = element.getAttribute("iterate").split(";")
    var start = (start) ? start : 0
    var stop = (stop) ? stop : attribute[0]
    dom.clone(element, "inside", (stop - start), attribute[1])
  }

  this.includeFile = function (e) {
    var file = e.getAttribute("include")
    app.debug("Include file: " + file, "green")
    var includeXhr = new xhr()
    includeXhr.get(currentEnvUrl + file, function (response, status) {
      if (status == 200) {
        e.innerHTML = response
        core.runAttributesInElement(e)
      }
    })

    e.removeAttribute("include")
  }

  this.includeBindFile = function (e, input, target, value) {
    var file = e.getAttribute("bindinclude")
    app.debug("Include (bind) file: " + file, "green")
    var bindXhr = new xhr()
    bindXhr.get(currentEnvUrl + file, function (response, status) {
      if (status == 200) {
        el = dom.get(target)
        el.innerHTML = response
        el.removeAttribute("include")
        dom.bind(el, value, input)
        core.runAttributesInElement(target)
      }
    })
  }

  this.setParam2 = function (uri, key, value) {
    return uri.replace(new RegExp("([?&]" + key + "(?=[=&#]|$)[^#&]*|(?=#|$))"), "&" + key + "=" + encodeURIComponent(value)).replace(/^([^?&]+)&/, "$1?")
  }

  this.setParam = function (uri, key, value) {
    function upperToHyphenLower(match, offset, string) {
      app.debug(match)
      return (offset > 0 ? "-" : "") + match.toLowerCase()
    }
    return uri.replace(new RegExp("([?&]" + key + "(?=[=&#]|$)[^#&]*|(?=#|$))"), "&" + key + "=" + encodeURIComponent(value)).replace(/^([^?&]+)&/, "$1?", upperToHyphenLower)
  }

  this.getParams = function (url) {
    var url = (url) ? url : window.location.href
    var params = {}
    var parser = document.createElement("a")
    parser.href = url
    var query = parser.search.substring(1)
    var vars = query.split("&")

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=")
      if (!pair[1]) pair[1] = ""
      params[pair[0]] = decodeURIComponent(pair[1] + "")
    }

    return params
  }

  this.toLower = function (str) {
    return str.toLowerCase()
  }
  this.toUpper = function (str, first) {
    return (first) ? str.charAt(0).toUpperCase() + str.slice(1) : str.toUpperCase()
  }
  this.split = function (str, sep, i) {
    return str.split(sep)[i]
  }
  this.replace = function (str, val1, val2) {
    return str.replace(new RegExp(val1, "gi"), val2)
  }
  this.trim = function (str) {
    return str.trim()
  }
  this.enum = function (int) {
    return frontEnums[int]
  }
  this.plug = function (str, plug) {
    return window[plug](str)
  }

  this.sortArray = function (array, propertyName) {
    return array.sort(function (a, b) {
      return a[propertyName].charCodeAt(0) - b[propertyName].charCodeAt(0)
    })
  }

  this.callAttributes = function (input, orgJson, isMod) {
    if (isMod) {
      var mod = orgJson.trim().split(" = ")
      mod.shift()

      for (i in mod) {
        var arg = (mod[i].indexOf(")") > 0) ? true : false
        if (arg) {
          var func = "core." + mod[i]
          func = func.replace("(", "('" + input + "',")
          input = eval(func)
        } else {
          input = eval("core." + mod[i] + "('" + input + "')")
        }
      }
    }
    return input
  }

  this.tagArray = function (array) {
    var current = null
    var u = 0
    for (j = 0; j < array.length; j++) {

      attr = array[j].getAttribute("index")
      if (attr) {
        u = attr
      } else {
        if (current != array[j].tagName) {
          current = array[j].tagName
          u = 0
        } else {
          u++
        }
      }

      array[j].tagIndex = u
    }

    return array
  }

  this.toArray = function (obj) {
    var arr = []
    if (obj)[].push.apply(arr, obj)
    return arr
  }

  this.toDOM = function (str) {
    return new DOMParser().parseFromString(str, "text/html")
  }

  this.toHTML = function (e) {
    var el = document.createElement('textarea')
    el.innerHTML = e.innerHTML
    return el.value
  }

  this.toObject = function (str) {
    obj = {}
    var KeyVal = str.split(",")
    for (i in KeyVal) {
      KeyVal[i] = KeyVal[i].split(":")
      obj[KeyVal[i][0]] = KeyVal[i][1]
    }
    return obj
  }

  this.mergeObject = function (str) {
    return str.replace(/}([\s]|){\s+/gm, "\t,\n\t")
  }

  this.isJson = function (str) {
    try {
      JSON.parse(str)
      return true
    } catch (err) {
      return false
    }
  }

  this.isString = function (obj) {
    return Object.prototype.toString.call(obj) === "[object String]"
  }
  this.isNumber = function (str) {
    return /^\d+$/.test(str)
  }
  this.isObject = function (obj) {
    return (typeof obj === "object" && !Array.isArray(obj) && obj !== null)
  }
}

var app = function () {
  var baseStartUrl

  this.getBaseUrl = function (url) {
    var str = url.split(urlDelimiter)
    str.pop()
    return str.join(urlDelimiter) + urlDelimiter
  }

  this.getNewUrl = function () {
    var count = currentScriptUrl.split("./").length
    return currentUrl.split("/").slice(0, -count).join("/")
  }

  this.setupElement = function (res) {
    var el,
      res = res.split("=")

    if (res[1].indexOf(".js") >= 0) {
      el = dom.get("script?tag=" + res[0])
      el.src = res[1]
    } else if (res[1].indexOf(".css") >= 0) {
      el = dom.get("link?tag=" + res[0])
      el.href = res[1]
    }
  }

  this.getCurrentEnvironment = function () {
    var el = dom.get("base?tag")
    if (el) {
      var isLocalDev = (baseUrl.match(/localhost|127.|[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}|::1|\.local|^$/gi)) ? true : false
      var attr = el.getAttribute("env").split(";")
      for (a in attr) {
        env = attr[a].split(":")
        if (isLocalDev)
          return env
        else if (env[0] == "prod" && !isLocalDev)
          return env
      }
    }

    return [0, baseUrl]
  }

  this.getBaseStartUrl = function () {
    return baseStartUrl
  }

  this.setFrontBaseUrl = function (dir) {
    newBaseUrl = currentScriptUrl.split(urlDelimiter)
    newBaseUrl[3] = dir + urlDelimiter + newBaseUrl[3]
    currentScriptUrl = newBaseUrl.join(urlDelimiter)
    app.debug("FrontBaseUrl changed: " + currentScriptUrl)
  }

  this.getPathUrl = function (url) {
    return new URL(url).pathname
  }

  this.storage = function (key, value) {
    if (key && value)
      localStorage.setItem(key, value)
    else if (key && value === null)
      localStorage.removeItem(key, value)
    else if (key == null && !value)
      localStorage.clear()
    else if (key && value === undefined)
      return localStorage.getItem(key)
  }

  this.runDevFile = function () {
    var devXhr = new xhr()
    devXhr.get(currentEnvUrl + ".env", function (response, status) {
      if (status == 200) {
        eval(response)
        app.debug("Include file: .env", "green")
      }
    }, true)
  }

  this.require = function (src, folder) {
    var type

    if (src.indexOf("http") >= 0) {
      src = src
      type = "script"
    } else if (src.indexOf(".js") >= 0) {
      src = baseUrl + src
      type = "script"
    } else if (src.indexOf(".css") >= 0) {
      src = src
      type = "link"
    } else {
      file = (folder == "plug") ? src + "/" + src : src
      src = currentScriptUrl + folder + urlDelimiter + file + ".js"
      type = "script"
    }

    var head = dom.get("head?tag"),
      asset = document.createElement(type)
    asset.src = src
    asset.href = src
    asset.rel = "stylesheet"
    asset.async = false
    asset.defer = "defer"
    asset.onload = function () {
      app.debug("Load: " + src)
    }

    head.appendChild(asset)
  }

  this.redirect = function (url) {
    top.location.href = url
  }

  this.scrollTo = function (element, to, duration) {
    if (duration < 0) return
    var difference = to - element.scrollTop,
      perTick = difference / duration * 2

    setTimeout(function () {
      element.scrollTop = element.scrollTop + perTick
      scrollTo(element, to, duration - 2)
    }, 10)

    app.debug("Scroll: " + element + ":" + to + ":" + duration)
  }

  this.debug = function (log, c, bc) {
    if (debugMode === "true") console.log("%c" + log, "color:" + c + ";background:" + bc)
  }
}

var dom = function () {

  var oldClass = ""

  this.get = function (obj) {
    if (core.isObject(obj)) return obj
    var res = obj.split(elementDivider)
    if (res[1] === "tag") {
      var index = (res[2]) ? res[2] : 0
      return document.getElementsByTagName(res[0])[index]
    } else if (res[1] === "name") {
      return document.getElementsByName(res[0])
    } else {
      return document.getElementById(res[0])
    }
  }

  this.bind = function (target, value, input) {
    if (value[0] == "?") {
      input = core.getParams()[value.substr(1)]
      value = "\\" + value
    }

    var match = "{# " + value + "(.*?)#}"

    for (var i = 0; i < target.attributes.length; i++) {
      var attr = target.attributes[i],
        attrName = attr.name + "-init"

      if (target.hasAttribute(attrName)) target.setAttribute(attr.name, target.getAttribute(attrName).b64d())

      if (attr.value.match(match, "gi")) {
        var init = attr.value.b64e()
        var attrVal = attr.value.replace(new RegExp(match, "gi"), function (out1, out2) {
          var isMod = (out1.indexOf("=") > 0) ? true : false
          return core.callAttributes(input, input + out2, isMod)
        })
        attr.value = attrVal
        target.setAttribute(attrName, init)
      }
    }

    if (target.init)
      target.innerHTML = target.init
    else
      target.init = target.innerHTML

    if (target.innerHTML.match(match, "gi")) {
      target.innerHTML = target.innerHTML.replace(new RegExp(match, "gi"), function (out1, out2) {
        var isMod = (out1.indexOf("=") > 0) ? true : false
        return core.callAttributes(input, input + out2, isMod)
      })
    }

  }

  this.run = function (el) {
    var start = performance.now()
    var obj = this.get(el)
    this.enable(obj, true)
    var el = this.get(el)
    if (!el.getAttribute("run")) core.runAttributesInElement(el)
    el.setAttribute("run", "true")
    var end = performance.now()
    app.debug("Run finished: " + (end - start) + " ms")
  }

  this.enable = function (e, enable) {
    if (!enable)
      e.outerHTML = e.outerHTML.replace(/(?!name|class|id)\b\S+="/ig, function (out) {
        return "d-" + out
      })
    else
      e.outerHTML = e.outerHTML.replace(/d-/ig, "")
  }

  this.exists = function (obj) {
    var el = this.get(obj)
    if (typeof (el) !== "undefined" && el != null)
      return true
    else
      return false
  }

  this.populate = function (obj) {
    var target = this.get(obj.getAttribute("populate"))
    target.innerHTML = obj.innerHTML
  }

  this.hide = function (obj) {
    var el = this.get(obj)
    if (el) el.setAttribute("style", "display: none !important")
  }

  this.show = function (obj) {
    var el = this.get(obj)
    if (el) el.setAttribute("style", "display: block !important")
  }

  this.toggle = function (obj) {
    var el = this.get(obj)
    var di = el.style.display
    if (di == "block") this.hide(obj)
    else this.show(obj)
  }

  this.focus = function (obj) {
    this.get(obj).focus()
  }

  this.remove = function (obj) {
    var el = this.get(obj)
    if (el) el.parentNode.removeChild(el)
  }

  this.content = function (obj, content) {
    var el = this.get(obj)
    if (el && (content || content === ""))
      el.innerHTML = content
    else return el.innerHTML
  }

  this.iHtml = function (obj, html) {
    return obj.innerHTML = html
  }

  this.oHtml = function (obj, html) {
    return obj.outerHTML = html
  }

  this.source = function (obj, source) {
    var el = this.get(obj)
    if (el && source) el.src = source
    else return el.src
  }

  this.value = function (obj, value) {
    var el = this.get(obj)
    if (el && value != null) el.value = value
    else return el.value
  }

  this.placeholder = function (obj, value) {
    var el = this.get(obj)
    if (el && value != null) el.placeholder = value
    else return el.placeholder
  }

  this.width = function (obj, value) {
    var el = this.get(obj)
    if (el && value != null) el.width = value
    else return el.width
  }

  this.height = function (obj, value) {
    var el = this.get(obj)
    if (el && value != null) el.height = value
    else return el.height
  }

  this.dimension = function (obj, measure, value) {
    var el = this.get(obj)
    if (el && value != null) el.width = value
    else return el.width
    if (el && value != null) el.height = value
    else return el.height
  }

  this.checked = function (obj) {
    var el = this.get(obj)
    if (el.checked) return true
    else return false
  }

  this.class = function (obj, action, classname) {

    var el = this.get(obj)

    try {
      var classVal = el.getAttribute("class")
      var bclass = el.getAttribute("bindclass")

      if (action == "add") {
        el.classList.add(classname)
      } else if (action == "remove") {
        el.classList.remove(classname)
      } else if (action == "toggle") {
        el.classList.toggle(classname)
      } else if (action == "update") {
        var bname = el.classList.item(bclass)
        app.debug(bname)
        el.className = el.className.replace(bname, classname)
      } else if (action == "reset") {
        el.classList.remove(classname)
        el.offsetWidth = el.offsetWidth // fix
        el.classList.add(classname)
      }

    } catch (err) {
      return false
    }
  }

  this.click = function (obj) {
    var el = this.get(obj)
    el.click()
    return false
  }

  this.reset = function (obj) {
    var el = this.get(obj)
    if (el) el.reset()
  }

  this.audio = function (obj, action) {
    var el = this.get(obj)
    if (action == "play") {
      if (el) el.play()
    } else if (action == "stop") {
      if (el) el.pause()
      if (el) el.currentTime = 0.0
    }
  }

  this.update = function (el, arr) {
    var el = this.get(el)
    //console.dir(el)
    var props = "el." + arr[0] + "('" + arr[1] + "', '" + arr[2] + "')"
    if (el) eval(props)
  }

  this.create = function (el, arr, target, prepend) {
    var el = document.createElement(el)
    for (i in arr) {
      var props = arr[i].split(/=(.+)/)
      eval("el." + props[0] + " = '" + props[1] + "'")
    }

    if (target) {
      var parent = document.getElementsByTagName(target)[0]
      if (prepend)
        parent.insertAdjacentElement('afterbegin', el)
      else
        parent.appendChild(el)
    } else {
      document.body.appendChild(el)
    }
  }

  this.clone = function (el, parent, copies, variables) {
    var cln = el.cloneNode(true)

    if (parent === "head") {
      document.getElementsByTagName("head")[0].appendChild(cln)
    } else if (parent === "inside") {
      el.innerHtml = ""
      var elHtml = el.innerHTML,
        html = "",
        pad = 0,
        iterateOnly = el.getAttribute("iterate"),
        selected = el.hasAttribute("selected"),
        index = el.index,
        attrVal = (variables) ? el.getAttribute("variable").split(":") : 0,
        increment = (variables) ? attrVal[1] : 0

      if (core.isNumber(iterateOnly) && index !== parseFloat(iterateOnly)) {
        el.remove()
      } else if (index === parseFloat(iterateOnly)) {
        html += elHtml
        if (selected) el.selected = 'selected'
      }

      if (increment) {
        pad = increment.match(/(0*)/s)[0]
        pad = (pad || []).length
      }

      for (var j = 0; j < copies; j++) {
        if (variables) {
          elVarHtml = elHtml.replace(new RegExp("<var>" + attrVal[0] + "<\/var>|{{(.*?)" + attrVal[0] + "(.*?)}}", "gi"), function (out1, out2, out3) {
            var input = dom.pad(increment, pad),
              isMod = (out1.indexOf("=") > 0) ? true : false
            return core.callAttributes(input, input + out3, isMod)
          })
          html += elVarHtml
        } else {
          html += elHtml
        }

        increment++
      }

      el.innerHTML = html

    } else {
      document.body.appendChild(cln)
    }
  }

  this.pad = function (num, size) {
    var s = num + ""
    if (s.length <= size) s = "0" + s
    return s
  }

  this.escape = function (text) {
    return text.replace(/[\u0009\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF]/g, function (x) {
      return "&#" + ("000" + x.charCodeAt(0)).substr(-4, 4) + ";"
    })
  }

  this.unescape = function (text) {
    var el = document.createElement("textarea")
    el.innerHTML = text
    return el.value
  }

  this.nl2br = function (text) {
    return text.replace(/(?:\r\n|\r|\n)/g, "<br>")
  }

  this.insertAt = function (text, index, string) {
    return text.substr(0, index) + string + text.substr(index)
  }

  this.copyText = function (el) {

    var el = (core.isString(el)) ? this.get(el) : el
    el = dom.getElementsByAttribute("bindcopy", el.children)
    var text = el[0].innerText

    if (window.clipboardData && window.clipboardData.setData) {
      return clipboardData.setData("Text", text)
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea")
      textarea.textContent = text
      textarea.style.position = "fixed"
      document.body.appendChild(textarea)
      textarea.select()
      try {
        return document.execCommand("copy")
      } catch (ex) {
        console.warn("Copy to clipboard failed.", ex)
        return false
      } finally {
        document.body.removeChild(textarea)
        alert(text + " copied!")
      }
    }
  }

  this.resize = function (el, value) {
    var el = this.get(el)
    el.style.resize = "both"
  }

  this.scrollInto = function (el, bool) {
    var target = this.get(el)
    if (!bool)
      target.scrollIntoView()
    else
      target.scrollTop = bool
  }

  this.set = function (type, param, value) {

    var el = event.target || event.srcElement
    var res = el.getAttribute("bind1").split(bindDivider)

    if (res[1]) {
      var resEl = this.get(res[0])
      var attr = resEl.getAttribute(res[1])
      resEl.setAttribute(res[1], core.setParam(attr, param, value))

      var func = resEl.getAttribute("datasourceonchange")
      window[func](resEl)

      //eval(func)

    } else {
      dom.content(el.name, value)
    }
  }

  this.getElementsByAttribute = function (attribute, context) {
    var i = 0,
      node = null,
      nodes = [],
      select = (context) ? context : front

    while (node = select[i++]) {
      if (node.hasAttribute(attribute)) nodes.push(node)
    }

    return nodes
  }

  this.getChildren = function (el) {
    var el = this.get(el)
    if (!el)
      return false
    else if (typeof (el["content"]) !== "undefined")
      return el.content.children;
    else if (typeof (el["children"]) !== "undefined")
      return el.children
    else
      var i = 0,
        node, nodes = el.childNodes,
        children = []
    while (node = nodes[i++]) {
      if (node.nodeType === 1) {
        children.push(node)
      }
    }
    return children
  }

  this.removeTags = function (str, tags) {
    var rtags = ""
    for (i in tags) {
      rtags += "<\\/?" + tags[i] + "[^>]*>|"
    }
    var re = new RegExp(rtags, "gi")
    str = str.replace(re, "")
    return str
  }

  this.removeAllTags = function (str) {
    return str.replace(/(<([^>]+)>)/ig, "")
  }

  return false
}

var xhr = function () {

  var request = new XMLHttpRequest(),
    headers = [],
    credentials = false,
    x = 0

  this.addHeader = function (header, value) {
    headers.push([header, value])
  }

  this.getResponseHeader = function (header) {
    return decodeURI(escape(request.getResponseHeader(header)))
  }

  this.resetProgress = function () {
    if (xhrProgress)
      xhrProgress.style.width = "0%"
    _.show("navloader")
  }

  this.get = function (url, callback, async) {
    var async = (async ===false) ? false : true
    request.open("GET", url, async)

    if (credentials) {
      request.withCredentials = true
    }

    if (headers) {
      for (var i in headers)
        request.setRequestHeader(headers[i][0], headers[i][1])
    }

    request.onload = function () {
      callback(this.responseText, this.status, headers)
      headers.length = 0
      client.resetProgress()
    }

    request.onloadstart = function () {
      client.resetProgress()
    }

    request.onprogress = function () {
      if (xhrProgress) {
        _.show("navloader")
        if (x == 0) {
          x = 1
          var width = 1
          var id = setInterval(frame, 0)

          function frame() {
            if (width >= 100) {
              _.hide("navloader")
              clearInterval(id)
              x = 0
            } else {
              width++
              xhrProgress.style.width = width + "%"
            }
          }
        }
      }
    }

    request.onerror = function () {
      //callback("error")
    }

    request.ontimeout = function (e) {
      //callback("timeout")
    }

    request.send(null)
  }

  this.post = function (url, data, callback) {
    request.open("POST", url, true)
    request.setRequestHeader("Content-Type", "application/json")
    request.onload = function () {
      callback(this.responseText)
      app.debug("%c API (Response): " + this.responseText, "blue", "yellow")
    }
    app.debug("%c API (POST): " + JSON.stringify(data), "green", "white")
    request.send(JSON.stringify(data))
  }
}

String.prototype.b64e = function () {
  return btoa(unescape(encodeURIComponent(this)))
}
String.prototype.b64d = function () {
  return decodeURIComponent(escape(atob(this)))
}

var core = new core()
var app = new app()
var dom = new dom()
var socket = new xhr()
var client = new xhr()
var _ = dom

export { core, app, dom, socket, client }