/*
    Author: Josef Gabrielsson
    Version: 1.0.3
    Comments:
    =   &#0061;     <  &#0060;      >  &#0062;
    "   &#0034;     '  &#0039;      /  &#0047;
    !   &#0033;     -  &#0045;
*/

libAttribute.push(
    {'attr': 'formatify', 'func': 'formatify'}
);

function formatify(el) {
    var attr = el.getAttribute("formatify").split(";");
    var target = el;
    el = _.unescape(target.innerHTML.trim());

    var tab = "\t",
        result = "",
        indent = "";

    el.split(/>\s+<[^>\s<\/]{0}/).forEach(function(element) {
        if (element.match(/^\/\w/)) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';
        if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("hr"))
            indent += tab;
    });

    result = _.escape(result.substring(1, result.length-3));
    result = formatify_colorize(result, attr);

    target.innerHTML = result;
}

function formatify_colorize(text, attr){
    
    var color = [];

    for(val in attr){
        var prop = attr[val].split(":");
        if (prop[0] == "colors")
            color = prop[1].split(",");
    }

    //Name
    text = text.replace(/(\w+&#0062;|&#0060;\w+|&#0060;&#0047;\w+)/ig, function(x){
        var pos = (x.substr(0, 14) == "&#0060;&#0047;") ? 14 : 7;
        var x = dom.insertAt(x, pos, '<span class="'+color[0]+'">');
        return x+'</span>';
    });

    //Attribute
    text = text.replace(/[\w]+&#0061;/ig, function(x){
            var a = dom.insertAt(x, (x.length - 7), "</span>");
            return '<span class="'+color[1]+'">'+a;
    });

    //Value
    var text = text.replace(/&#0034;(.*?)&#0034;/ig, function(x){
        return '<span class="'+color[2]+'">'+x+'</span>';
    });

    //Bracket
    text = text.replace(/(&#0060;&#0047;|&#0060;|&#0062;)/ig, function(x){
        return '<span class="'+color[3]+'">'+x+'</span>';
    });

    //Comment
    text = text.replace(/<\w+\s+\S+&#0033;&#0045;&#0045;.(.*?).&#0045;&#0045;<\w+\s+\S+>/ig, function(x,y){
        return '<span class="'+color[4]+'">'+dom.removeAllTags(x)+'</span>';
    });

    return text;
}