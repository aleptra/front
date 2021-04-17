libAttribute.push(
    {'attr': 'formatify', 'func': 'formatify'}
);

function formatify(el) {

    var target = el;
    el = target.innerHTML.trim();

    var tab = "     ",
    result = "",
    indent = "";

    el.split(/>\s+<[^>\s<\/]{0}/).forEach(function(element) {
        if (element.match(/^\/\w/)) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input") && !element.startsWith("img"))
            indent += tab;
    });

    target.innerHTML = _.escape(result.substring(1, result.length-3));
}