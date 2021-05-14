libAttribute.push(
{'attr': 'navigate', 'func': 'nav'}
);

var globalUrl = app.getCurrentEnvironment()[1];
var navTargetEl = "main?tag";
var hash = location.hash;
var historyStack = [];

window.addEventListener("popstate", function(e){
	if(location.href.indexOf('#') !== -1){
		return false;
	}else if (window.history && window.history.pushState){
		var href = e.target.location.pathname;
		return nav(href, false, false);
	}else{
		self.location.href = globalUrl;
	}
});

function nav(path, el, push){
	var path = (globalUrl == path || path === globalUrl+"./") ? startpage : path;
	var target = (el === undefined || el === false) ? navTargetEl : el;
	var contentOrginal = dom.content(target);
	var anchor = (path) ? path.split("#") : '';
	client.addHeader("Path", path);
	client.addHeader("Cache-Control", "must-revalidate");
	client.get(path, function(response){
		if (response){
			if (push || path == startpage) navPush(path);
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
		}
	});

	loadTemplate = false;
	return false;
}

function navPush(url){
	var url = url.replace(startpage, "./");
	var title = dom.get("title?tag").textContent;
	var stateObj = { path: url };
	var historyStackLast = historyStack.length -1;

	if (historyStack[historyStackLast] !== url) {
		historyStack.push(url);
		history.pushState(stateObj, title, url);
	}
}