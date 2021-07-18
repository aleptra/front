libAttribute.push(
    {'attr': 'globalize', 'func': 'globalize'}
)

libPreload.push(
    {'func': 'globalizePreload'}
)

var htmlAttr = dom.get("html?tag"),
    localeLoad = true,
    localeJson,
    localeCode,
    defaultLocale = (htmlAttr.lang) ? htmlAttr.lang.split(";")[0] : 'en',
    browserLocale = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage

function globalizePreload(){

    var locale = defaultLocale
    var storageLocale = app.storage("locale")
    var queryLocale = core.getParams()['lang']

    if(queryLocale){
        locale = queryLocale
    }else if(htmlAttr.lang.indexOf("auto") > 0 && !storageLocale){
        locale = core.toLower(browserLocale)
    }else if(storageLocale){
        locale = storageLocale
    }

    globalizeChangeLanguage(locale)
}

function globalizeChangeLanguage(locale){
    locale = (locale) ? locale.split("-") : ''

    if(locale[0])
        globalizeLoadFile(locale[0])
    else if(locale[0] == "*")
        app.storage("locale", null)
}

function globalizeChangeMetaLanguage(lang){
    htmlAttr.lang = lang
}

function globalizeChangeMetaDir(dir){
    htmlAttr.dir = dir
    htmlAttr.classList.remove("ltr","rtl")
    htmlAttr.classList.add(dir)
}

function globalizeLoadFile(a2){
    var lclient = new xhr()
    lclient.get(currentEnvUrl + "assets/json/globalize/" + a2 + ".json", function(response, status){
        if(core.isJson(response)){
            localeJson = JSON.parse(response)
            localeCode = localeJson.code
            app.storage(a2, response)
            app.storage("locale", a2)
            globalizeChangeMetaDir(localeJson.direction)
            globalizeChangeMetaLanguage(a2)
            core.rerunLibAttributes("globalize")
        }
        if (status !== 200 && localeLoad){
            globalizeLoadFile(defaultLocale)
            localeLoad = false
        }
    })
}

function globalize(e){
    var value = e.getAttribute("globalize")
    e.innerHTML = e.innerHTML.trim()

    if(localeJson && localeJson.translations[value]){
        var children = e.childElementCount
        var name = e.localName
        var type = e.type
        var placeholder = e.placeholder
        var globalized = localeJson.translations[value]
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