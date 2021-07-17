libAttribute.push(
    {'attr': 'globalize', 'func': 'globalize'}
)

libPreload.push(
    {'func': 'globalizePreload'}
)

var htmlattr = dom.get("html?tag")
var trans = "en"
var userLanguage = "eng"
var browserLanguage = core.toLower(navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage).split("-")

function globalizePreload(){
    var q = (htmlattr.lang.indexOf("auto") > 0 && !app.storage("language") && !q) ? browserLanguage[0] : core.getParams()['lang']
    globalizeChangeLanguage(q)
}

function globalizeChangeLanguage(q){
    var q = (q) ? q.split("-") : ''
    var a2 = q[0]
    var a3 = q[1]

    if(a2) {
        client.get(currentEnvUrl + "assets/json/globalize/" + a2 + ".json", function(response){
            if (core.isJson(response)) {
                app.storage("language", a2)
                app.storage("country", a3)
                app.storage(a2, response)
                var lang = app.storage("language")
                trans = app.storage(lang) ? JSON.parse(app.storage(lang)) : ''
                globalizeChangeMetaDir(trans['direction'])
                globalizeChangeMetaLanguage(a2)
                core.rerunLibAttributes("globalize")
            }
        },false);
    }else if (a2 == "*") {
        app.storage("language", null)
    }else if (app.storage("language")){
        var lang = app.storage("language")
        trans = JSON.parse(app.storage(lang))
        userLanguage = trans["639-2"]
        globalizeChangeMetaDir(trans['direction'])
    }
}

function globalizeChangeMetaLanguage(lang){
    htmlattr.lang = lang
}

function globalizeChangeMetaDir(dir){
    htmlattr.dir = dir
    htmlattr.classList.remove("ltr","rtl")
    htmlattr.classList.add(dir)
}

function globalize(e){
    var value = e.getAttribute("globalize")
    e.innerHTML = e.innerHTML.trim()

    if(trans['translations'] && trans['translations'][value]){
        var children = e.childElementCount
        var name = e.localName
        var type = e.type
        var placeholder = e.placeholder
        var globalized = trans['translations'][value]
        if(children > 0 && (name == "a" || name == "button" || name == "caption")){
            var child = e.firstChild
            while(child){
                if(child.nodeType == 3){
                    child.data = globalized
                    break
                }
                child = child.nextSibling
            }
        }else if(placeholder){
            e.placeholder = globalized
        }else{
            if(type == "submit")
                e.value = globalized
            else if(name == "optgroup")
                e.label = globalized
            else
                e.innerHTML = globalized
        }
    }
}