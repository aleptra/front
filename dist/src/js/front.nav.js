libAttribute.push(
{'attr': 'navigate', 'func': 'nav'}
);

var globalUrl = baseUrl;
var navTargetEl = "main?tag";
var hash = location.hash;

//alert(hash);

window.addEventListener("popstate", function(e) {

	if(window.location.hash.indexOf("#", 1))
		return false;//alert('hej');
	if (e.state)
		nav(e.state.path.substr(1), navTargetEl, false);
	else
		self.location.href = globalUrl;
});

function nav(path, el, push) {
	
	var target = (el === undefined) ? navTargetEl : el;
	var contentOrginal = dom.content(target);
	var anchor = path.split("#");
	console.log(anchor[1]);
	console.dir(target);
	client.addHeader("Layout", "none");
	client.addHeader("Path", path);
	client.addHeader("Cache-Control", "must-revalidate");

	client.get(globalUrl + path, function(response) {
		if (response) {
			navPush(client.getResponseHeader("title"), path);
			dom.content(target, response);
			dom.class(target, "reset", "spaLoader");
			if (anchor[1]){
				console.dir(dom.get(anchor[1]));

				//alert(anchor[1]);
				dom.scrollInto(anchor[1]);
			}else{
				console.dir(dom.get(target));
				dom.scrollInto(target, true);
			}
			core.runCoreAttributesInElement(target);
			core.runLibAttributesInElement(target);
		}
	});

	return false;
}

function navPush(title, url){	
	if (window.history && window.history.pushState) {
		var stateObj = { path: globalUrl };
		history.pushState(stateObj, title, globalUrl + url);
	}else{
		location.hash = "#!" + url;
	}
}