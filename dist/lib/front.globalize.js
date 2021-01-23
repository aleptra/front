libAttribute.push(
    {'attr': 'globalize', 'func': 'globalize'}
);

libPreload.push(
    {'func': 'globalizePreload'}
);

var trans;

if (core.getParams()['lang']) {
    var file = core.getParams()['lang'];
    client.get(globalUrl + "assets/json/globalize/" + file + ".json", function(response) {
        if (response)
            app.storage("lang", file)
            app.storage(file, response)
    });
}

function globalizePreload(){
    var lang = app.storage("lang");
    trans = app.storage(lang) ? JSON.parse(app.storage(lang)) : '';
}

function globalize(e){
    var value = e.getAttribute("globalize");
    if (trans[value]) e.innerHTML = (trans[value]);
}