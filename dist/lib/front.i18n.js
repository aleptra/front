libAttribute.push(
{'attr': 'i18n', 'func': 'i18n'}
);

function i18n(el) {

    var e = event && (event.target || event.srcElement);
    
    if (e && e.attributes && e.attributes['i18n']){
        alert(e);
    }

}