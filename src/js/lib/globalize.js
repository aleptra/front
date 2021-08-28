libAttribute.push(
  {"attr": "globalize", "func": "globalize"}
)

libPreload.push(
  {"func": "globalizePreload"}
)

var htmlAttr = dom.get("html?tag"),
    localeLoad = true,
    localeJson,
    localeCode,
    localeCountry,
    defaultLocale = (htmlAttr.lang) ? htmlAttr.lang.split(";")[0] : "en",
    browserLocale = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage

function globalizePreload(){

  var locale = defaultLocale,
      storageLocale = app.storage("language"),
      queryLocale = core.getParams()['locale']

  if(queryLocale){
    locale = (queryLocale === "*") ? "" : queryLocale
  }else if(htmlAttr.lang.indexOf("auto") > 0 && !storageLocale){
    locale = core.toLower(browserLocale)
  }else if(storageLocale){
    locale = storageLocale
  }

  globalizeChangeLanguage(locale)
}

function globalizeChangeLanguage(locale){
  locale = (locale) ? locale.split("-") : ""
  var language = locale[0],
      country = locale[1] || ""

  if(language)
    globalizeLoadFile(language,country)
  else if(language == "*")
    app.storage("language", null)
    app.storage("country", null)
}

function globalizeChangeLanguageTags(lang, dir){
  htmlAttr.lang = lang
  htmlAttr.dir = dir
  htmlAttr.classList.remove("ltr","rtl")
  htmlAttr.classList.add(dir)
}

function globalizeLoadFile(language,country){
  var lclient = new xhr()
  lclient.get(currentEnvUrl + "assets/json/globalize/" + language + ".json", function(response, status){
    if(status == 200 && core.isJson(response)){
      localeJson = JSON.parse(response)
      localeCode = localeJson.code
      localeCountry = country
      app.storage(language, response)
      app.storage("language", language)
      app.storage("country", country)
      globalizeChangeLanguageTags(language, localeJson.direction)
      core.rerunLibAttributes("globalize")
    }
    if(status !== 200 && localeLoad){
      globalizeLoadFile(defaultLocale)
      localeLoad = false
    }
  })
}

function globalize(e){
  if (typeof e === "string") return localeJson.translations[e]

  var value = e.getAttribute("globalize")
  e.innerHTML = e.innerHTML.trim()

  if(localeJson && localeJson.translations[value]){
    var name = e.localName,
        type = e.type,
        placeholder = e.placeholder,
        globalized = localeJson.translations[value]
    if(name == "title"){
      document.title = globalized
    }else if(placeholder){
      e.placeholder = globalized
    }else{
      if(type == "submit" && name == "input")
        e.value = globalized
      else if(name == "optgroup")
        e.label = globalized
      else
        if(e.childElementCount > 0 && (name !== "p" && name !== "i" && name !== "b")){
          var child = e.firstChild
          while(child){
            if(child.nodeType == 3){
              child.data = globalized
              e.innerHTML = core.toHTML(e)
              break
            }
            child = child.nextSibling
          }
        }else{
          e.innerHTML = globalized
        }
    }
  }
}