libAttribute.push(
{'attr': 'navigate', 'func': 'nav'}
);

var globalUrl = app.setupEnvironment()[1];
var navTargetEl = "main?tag";
var hash = location.hash;

window.addEventListener("popstate", function(e){
	if(window.location.hash.indexOf("#", 1))
		return false;
	if (e.state)
		nav(e.state.path.substr(1), navTargetEl, false);
	else
		self.location.href = globalUrl;
});

function nav(path, el, push){
	var target = (el === undefined) ? navTargetEl : el;
	var contentOrginal = dom.content(target);
	var anchor = path.split("#");
	client.addHeader("Layout", "none");
	client.addHeader("Path", path);
	client.addHeader("Cache-Control", "must-revalidate");

	client.get(globalUrl + path, function(response){
		if (response){
			dom.content(target, response);
			
			if (anchor[1]){
				dom.scrollInto(anchor[1]);
			}else{
				dom.scrollInto(target, true);
			}

			var array = dom.getChildren("template?tag");
			for (var i = 0; i < array.length; i++){
				core.runCoreAttributesInElement(array[i]);
				core.runLibAttributesInElement(array[i]);
			}

			core.runCoreAttributesInElement(target);
			core.runLibAttributesInElement(target);

			navPush(dom.get("title?tag").textContent, path);
		}
	});

	loadTemplate = false;
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