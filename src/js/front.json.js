libAttribute.push(
{'attr': 'json', 'func': 'json'}
);


var jsonInitEl = [];
var jsonIndex = 0;

function json(el) {

    var e = event && (event.target || event.srcElement);
    
    if (e && e.attributes && e.attributes['bind']){
        attrBind = e.getAttribute("bind").split(".");
        bindEl = dom.get(attrBind[0]);
        clnEl = jsonInitEl[bindEl.getAttribute("jsonindex")];
        dom.scrollInto(attrBind[0], false);
    }else{
        var attr = document.createAttribute("jsonindex");
        attr.value = jsonIndex;
        el.setAttributeNode(attr);

        clnEl = el.cloneNode(true);
        jsonInitEl.push(clnEl);
        jsonIndex++;
    }

    var iterate = el.getAttribute('iterate');
    var url = el.getAttribute('datasource');
    var onprogress = el.getAttribute('onprogress');
    var onerror = el.getAttribute('onerror');
    var ondone = el.getAttribute('ondone');

    var xhr = new XMLHttpRequest();
    xhr.el = clnEl;
    xhr.open("GET", url, true);
    xhr.onloadstart = function () { }
    xhr.onprogress = function () { eval(onprogress) }
    xhr.onerror = function () { eval(onerror) }
    xhr.onload = function () {
        var data = xhr.responseText;
        var json = JSON.parse(data);

        if (iterate === "true") {
            json = json;
        }else{
            json = eval("json."+iterate);
        }
        
        el.innerHTML = xhr.el.innerHTML;

        var length = (iterate) ? json.length : iterate;
        core.runIteration(el, 0, length);

        els = el.getElementsByTagName("*");
        elBreak = xhr.el.getElementsByTagName("*").length;

        var j = -1;
        
        for (i = 0; i < els.length; i++) {
            
            if (i % elBreak == 0) {
                j++;
            }

            var jsonget = els[i].getAttribute("jsonget");
            var jsonset = els[i].getAttribute("jsonset");
            var jsonbefore = (els[i].getAttribute("jsonbefore")) ? els[i].getAttribute("jsonbefore") : '';
            var jsonafter = (els[i].getAttribute("jsonafter")) ? els[i].getAttribute("jsonafter") : '';
            
            els[i].outerHTML = els[i].outerHTML.replace(/{{ jsonget:(.*?) }}/gi, function(e,$1) {
                return json[j][$1]
            });

            if (jsonset) {
                var res = jsonset.split(":");
                var value = jsonbefore + json[j][res[0]] + jsonafter;
                els[i].setAttribute(res[1], value);
            }
            if (jsonget) {
                var value = jsonbefore + json[j][jsonget] + jsonafter;
                var type = els[i].localName;
                
                if (type == "img")
                    els[i].src = value;
                else if(type == "a")
                    els[i].href = value;
                else
                    els[i].innerHTML = value.replace(/<[^>]+>/g, '');
            }
        }

        eval(ondone);
        core.runCoreAttributesInElement(el);
    }
    xhr.send(null);
}