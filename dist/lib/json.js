libAttribute.push({
  "attr": "json",
  "func": "json"
}, {
  "attr": "datapull",
  "func": "dataPull"
}, {
  "attr": "datapush",
  "func": "dataPush"
})

window.addEventListener("submit", function (e) {
  var form = e.target || e.srcElement,
    target = form.getAttribute("target")
  reset = form.getAttribute("reset")
  if (target !== "_blank") {
    e.preventDefault()
    var payload = jsonSerialize(form)
    jsonPush(payload, form)
    app.debug("Payload: " + payload)
    if (reset !== "false") form.reset()
  }
  return false
})

var jsonInitEl = [],
  jsonIndex = 0

function json(aEl) {
  var attr = aEl.getAttribute("json").split(";"),
    target = attr[0],
    loader = attr[1],
    el = (target === "true") ? aEl : dom.get(target),
    e = event && (event.target || event.srcElement)

  if (e && e.attributes && e.attributes["bind1"]) {
    attrBind = e.getAttribute("bind1").split(".")
    bindEl = dom.get(attrBind[0])
    clnEl = jsonInitEl[bindEl.getAttribute("jsonindex")]
    dom.scrollInto(attrBind[0], false)
  } else {
    var attr = document.createAttribute("jsonindex")
    attr.value = jsonIndex
    el.setAttributeNode(attr)

    clnEl = el.cloneNode(true)
    jsonInitEl.push(clnEl)
    jsonIndex++
  }

  var url = el.getAttribute("datasource"),
    headers = el.getAttribute("dataheader"),
    iterate = el.getAttribute("iterate"),
    filter = el.getAttribute("jsonfilter"),
    onstart = el.getAttribute("onstart"),
    onprogress = el.getAttribute("onprogress"),
    onerror = el.getAttribute("onerror"),
    ondone = el.getAttribute("ondone"),
    onempty = el.getAttribute("onempty")

  var xhr = new XMLHttpRequest()
  xhr.el = clnEl
  xhr.aEl = aEl
  xhr.id = Date.now()
  xhr.open("GET", url)

  if (headers) {
    headers = headers.split(";")
    for (var i in headers) {
      var header = headers[i].trim().split(":")
      xhr.setRequestHeader(header[0], header[1])
    }
  }

  xhr.onloadstart = function () {
    eval(onstart)
    if (!loader) {
      el.innerHTML = ""
      el.insertAdjacentHTML("afterend", '<div id="loader' + xhr.id + '" class="loader"></div>')
    } else {
      aEl.innerHTML = aEl.innerHTML.replace(/(.*?)loader="(.*?)">(.*?)</gi, function (e, out, out2, out3) {
        var attr = e.match(/(?!name|class|id)\S+="\S+"/ig).join(" ")
        return out + '><span class="loader" ' + attr + '></span><'
      })
    }
  }

  xhr.onloadend = function () {
    headers = "";
    dom.remove("loader" + xhr.id)
  }

  xhr.onprogress = function () {
    eval(onprogress)
  }

  xhr.onerror = function () {
    eval(onerror)
  }

  xhr.onload = function () {

    jsonParseHeader(xhr.getAllResponseHeaders(), target)

    var data = xhr.responseText,
      json = JSON.parse(data)

    if (json.length == 0) eval(onempty)

    el.innerHTML = xhr.el.innerHTML

    if (filter) {
      var index = (filter.match(/\((\d)\);/s) || [])[1]
      var str = filter.replace("(" + index + ");", "").replace(/:/g, "===").replace(/;/g, " && x.")
      json = (json[iterate]) ? json[iterate] : json
      json = json.filter(eval("x => x." + str))
      json = (index) ? [json[index]] : json
    }

    if (iterate) {
      json = (iterate.indexOf(".") > 0 && iterate.indexOf("[") < 0) ? json[0] : json
      json = (iterate === "true" || iterate === "false") ? json : eval("json." + iterate) || json
      var length = (iterate) ? json.length : iterate
      core.runIteration(el, 0, length)
    }

    els = el.getElementsByTagName("*")
    elBreak = xhr.el.getElementsByTagName("*").length

    var j = -1

    for (i = 0; i < els.length; i++) {

      if (i % elBreak == 0) {
        j++
      }

      var jsonget = els[i].getAttribute("jsonget"),
        jsonset = els[i].getAttribute("jsonset"),
        jsonbefore = (els[i].getAttribute("jsonbefore")) ? els[i].getAttribute("jsonbefore") : '',
        jsonafter = (els[i].getAttribute("jsonafter")) ? els[i].getAttribute("jsonafter") : ''

      els[i].outerHTML = els[i].outerHTML.replace(/{{\s*jsonget\s*:\s*(.*?)\s*}}/gi, function (e, $out) {
        return jsonParse(json[j], $out)
      })

      if (jsonset) {
        var res = jsonset.split(":"),
          value = jsonbefore + json[j][res[0]] + jsonafter
        els[i].setAttribute(res[1], value)
      }
      if (jsonget) {
        var parseValue = jsonParse(json[j], jsonget),
          type = els[i].localName
        value = jsonbefore + parseValue + jsonafter
        if (type == "input")
          els[i].value = value
        else if (type == "img")
          els[i].src = value
        else if (type == "a")
          els[i].href = value
        else
          els[i].innerHTML = value.replace(/<[^>]+>/g, "")
      }
    }

    core.runCoreAttributesInElement(el)
    core.runLibAttributesInElement(el)
    eval(ondone)
  }
  xhr.send(null)
}

function jsonFilter(array, test) {
  var passedTest = [];
  for (var i = 0; i < array.length; i++) {
    if (test(array[i]))
      passedTest.push(array[i]);
  }

  return passedTest;
}

function jsonParse(input, json) {
  try {
    var isMod = (json.indexOf("=") > 0) ? true : false,
      isAssociative = (json.indexOf(".") > 0) ? true : false,
      value = "",
      orgJson = json,
      parse

    if (isMod) json = json.split(" ")[0]

    if (isAssociative) {
      var split = json.split(".")
      for (i in split) {
        value += "['" + split[i] + "']"
      }
      parse = core.callAttributes(eval("input" + value), orgJson, isMod)
    } else {
      parse = core.callAttributes(input[json], orgJson, isMod)
    }

    return (parse === undefined) ? '' : parse

  } catch (err) {
    return ""
  }
}

function jsonParseHeader(responseHeaders, target) {

  var arr = responseHeaders.trim().split(/[\r\n]+/),
    responseHeader = {}
  arr.forEach(function (line) {
    var parts = line.split(": "),
      header = parts.shift(),
      value = parts.join(": ")
    responseHeader[header] = value
  })

  var re = /{{\s*jsonheader\s*:\s*(.*?)\s*}}/gi

  for (var i = 0; i < bindEls.length; i++) {
    var id = bindEls[i]['e'].getAttribute("json")
    if (target == id) bindEls[i]['el'].innerHTML = bindEls[i]['el'].innerHTML.replace(re, function (e, out) {
      var first = out.split("=")[0].trim(),
        isMod = (out.indexOf("=") > 0) ? true : false
      return core.callAttributes(responseHeader[first], out, isMod)
    })
  }
}

function jsonSerialize(inputs) {
  var pairs = {}
  for (var i = 0; i < inputs.length; i++) {
    var payload = inputs[i].getAttribute("payload"),
      type = inputs[i].getAttribute("type"),
      name = inputs[i].name,
      value = inputs[i].value
    if (name && (payload !== "false" || type !== "submit" || type !== "reset"))
      pairs[name] = value
  }
  return JSON.stringify(pairs, null, 2)
}

function jsonPush(payload, e) {
  var url = e.getAttribute("datasource"),
    headers = e.getAttribute("dataheader"),
    ondone = e.getAttribute("ondone"),
    method = (e.hasAttribute("method")) ? e.getAttribute("method").toUpperCase() : "POST"

  var xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  xhr.onreadystatechange = function () {
    app.debug("Push status: " + this.status)
    if (this.readyState == 4 && (this.status == 200 || this.status == 201 || this.status == 204))
      eval(ondone)
  }

  if (headers) {
    headers = headers.split(" ; ")

    for (var i in headers) {
      var header = headers[i].split(":")
      xhr.setRequestHeader(header[0], header[1])
    }
  }

  if (payload.length > 2) xhr.send(payload)
}

function dataForcePush(el) {
  var payload = jsonSerialize(el)
  jsonPush(payload, el)
  app.debug(payload)
}

function dataPush(el) {
  var attr = el.getAttribute("datapush"),
    interval = (attr < 1000) ? 1500 : attr,
    count = 0
  var i = setInterval(function () {
    var newEl = dom.get(el.id)
    if (newEl) {
      dataForcePush(newEl)
      count++
    } else {
      clearInterval(i)
    }
    app.debug("Interval: " + interval)
  }, interval)
}

function dataPull() {

}