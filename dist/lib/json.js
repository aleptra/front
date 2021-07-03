libAttribute.push(
{'attr': 'json', 'func': 'json'},
{'attr': 'datapull', 'func': 'dataPull'},
{'attr': 'datapush', 'func': 'dataPush'},
);

window.addEventListener("submit", function(e){
    e.preventDefault()

    var e = e.target || e.srcElement
    payload = jsonSerialize(e)
    console.dir(payload)

    jsonPost(payload, e)

    e.reset()
    return false
})

var jsonInitEl = []
var jsonIndex = 0

function json(aEl) {
    var attr = aEl.getAttribute("json").split(";")
    var target = attr[0]
    var loader = attr[1]
    var el = (target === "true") ? aEl : dom.get(target)
    var e = event && (event.target || event.srcElement)
 
    if (e && e.attributes && e.attributes['bind']){
        attrBind = e.getAttribute("bind").split(".")
        bindEl = dom.get(attrBind[0]);
        clnEl = jsonInitEl[bindEl.getAttribute("jsonindex")]
        dom.scrollInto(attrBind[0], false)
    }else{
        var attr = document.createAttribute("jsonindex")
        attr.value = jsonIndex
        el.setAttributeNode(attr)

        clnEl = el.cloneNode(true)
        jsonInitEl.push(clnEl)
        jsonIndex++
    }

    var iterate = el.getAttribute('iterate')
    var url = el.getAttribute('datasource')
    var headers = el.getAttribute('dataheader')
    var onprogress = el.getAttribute('onprogress')
    var onerror = el.getAttribute('onerror')
    var ondone = el.getAttribute('ondone')

    var xhr = new XMLHttpRequest()
    xhr.el = clnEl
    xhr.aEl = aEl
    xhr.id = Date.now()
    xhr.open("GET", url, true)

    if(headers){
        headers = headers.split(";")
        for (var i in headers) {
            var header = headers[i].trim().split(":")
            xhr.setRequestHeader(header[0], header[1])
        }
    }
    xhr.onloadstart = function(){
        if (!loader) {
            el.innerHTML = ''
            el.insertAdjacentHTML("afterend", '<div id="loader'+xhr.id+'" class="loader"></div>') 
        }else{
            /*aEl.outerHTML = aEl.outerHTML.replace(/(.*?)loader="(.*?)">(.*?)</gi, function(e,out,out2,out3) {
                var attr = e.match(/(?!name|class|id)\S+="\S+"/ig).join(" ")
                return out+'><span class="loader" '+attr+'></span><'
            })*/
        }
    }
    xhr.onloadend = function(){headers = ""; dom.remove("loader"+xhr.id)}
    xhr.onprogress = function(){eval(onprogress)}
    xhr.onerror = function(){ eval(onerror) }
    xhr.onload = function(){
        var responseHeaders = xhr.getAllResponseHeaders()
        var arr = responseHeaders.trim().split(/[\r\n]+/)
        var responseHeader = {}
        arr.forEach(function(line){
            var parts = line.split(': ')
            var header = parts.shift()
            var value = parts.join(': ')
            responseHeader[header] = value
        })

        var data = xhr.responseText
        var json = JSON.parse(data)

        json = (iterate === "true" || iterate === "false") ? json : eval("json."+iterate)
        el.innerHTML = xhr.el.innerHTML

        var length = (iterate) ? json.length : iterate
        core.runIteration(el, 0, length)

        els = el.getElementsByTagName("*")
        elBreak = xhr.el.getElementsByTagName("*").length

        var j = -1;
        
            for (i = 0; i < els.length; i++) {
            
                if (i % elBreak == 0) {
                    j++
                }
                
                var jsonget = els[i].getAttribute("jsonget")
                var jsonset = els[i].getAttribute("jsonset")
                var jsonbefore = (els[i].getAttribute("jsonbefore")) ? els[i].getAttribute("jsonbefore") : ''
                var jsonafter = (els[i].getAttribute("jsonafter")) ? els[i].getAttribute("jsonafter") : ''

                els[i].outerHTML = els[i].outerHTML.replace(/{{\s*jsonget\s*:\s*(.*?)\s*}}/gi, function(e,$out) {
                    return jsonParse(json[j], $out)
                })

                if (jsonset) {
                    var res = jsonset.split(":")
                    var value = jsonbefore + json[j][res[0]] + jsonafter
                    els[i].setAttribute(res[1], value)
                }
                if (jsonget) {
                    var value = ""
                    var type = els[i].localName

                    value = jsonbefore + jsonParse(json[j], jsonget) + jsonafter

                    if (type == "img")
                        els[i].src = value
                    else if(type == "a")
                        els[i].href = value
                    else
                        els[i].innerHTML = value.replace(/<[^>]+>/g, '')
                }
        }

        eval(ondone)
        core.runCoreAttributesInElement(el)

        aEl.outerHTML = aEl.outerHTML.replace(/{{\s*jsonheader\s*:\s*(.*?)\s*}}/gi, function(e, out){
            var first = out.split("=")[0].trim()
            var isMod = (out.indexOf("=") > 0) ? true : false
            return core.callAttributes(responseHeader[first], out, isMod)
        })
    }
    xhr.send(null)
}

function jsonParse(input, json){
    var isMod = (json.indexOf("=") > 0) ? true : false
    var isAssociative = (json.indexOf(".") > 0) ? true : false
    var value = ""
    var orgJson = json

    if (isMod) json = json.split(" ")[0]

    if (isAssociative) {
        var split = json.split(".");
        for(i in split) {
            value += "['" + split[i] + "']"
        }
        return core.callAttributes(eval("input"+value), orgJson, isMod)
    }

    return core.callAttributes(input[json], orgJson, isMod)
}

function jsonSerialize(inputs){
    formData = new FormData(inputs);
    const pairs = {};

    for (const [name, value] of formData) {
        pairs[name] = value;
    }

    return JSON.stringify(pairs, null, 2);
}

function jsonPost(payload, e){
    var url = e.getAttribute('datasource');
    var headers = e.getAttribute('dataheader');
    var ondone = e.getAttribute('ondone')
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function(){
        console.log(this.status)
        if(this.readyState == 4 && (this.status == 200 || this.status == 201))
            eval(ondone)
    }

    if (headers) {
        headers = headers.split(" ; ");

        for (var i in headers) {
            var header = headers[i].split(":");
            xhr.setRequestHeader(header[0], header[1])
        }
    }

    if (payload.length > 2) xhr.send(payload);
}

function dataPush(el){
    var attr = el.getAttribute("datapush"),
        interval = (attr < 1000) ? 1500 : attr,
        count = 0;

    setInterval(function() {
        console.log("Push: " + count);
        //json(el);
        //core.runCoreAttributesInElement(e);
        //return poll;
        count++;
    },interval);
}

function dataPull(){
    
}