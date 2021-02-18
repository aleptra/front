var front;
var frontVariables = [];
var libAttribute = [];
var libPreload = [];
var load = false;

var urlDelimiter = '/';
var elementDivider = /[?=]/;
var bindDivider = '.';

var url;
var title;
var currentUrl;
var currentScriptUrl;
var referrerUrl;
var baseUrl;

document.onkeyup=function(e) {
	if( e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA" || e.target.isContentEditable) return;
	var key = String.fromCharCode(e.keyCode);
	for (i = 0; i < front.length; i++) {
		if (front[i].hasAttribute("key"))
			if (front[i].getAttribute("key") == key)
				alert(key);
	}
}

document.onclick=function(e) {
	var clicked = (e.target) ? e.target : e.srcElement;

	if (clicked.parentNode.getAttribute("selective")) {
		
		for(j=0; j < clicked.parentNode.childElementCount; j++) {
			clicked.parentNode.children[j].classList.remove("sel");
		}

		clicked.classList.add("sel");
	}

	var el = getParentTag(clicked, "a");
	if (el !== null) {
		var elHref = el.getAttribute("href");
		var elTarget = el.getAttribute("target");
		if(el.hasAttribute("window")) {
			dom.create("div", ["href=/"], "head")
			alert('hej');
			return false;
		}else if(elHref && elHref.substring(0,1) === "#") {
			location.hash = elHref;
			return false;
		}else if(elHref && elHref.substring(0, 11) !== "javascript:" && elTarget !== "_top" && elTarget !== "_blank") {
			console.log('Click with Ajax: '+ elHref);
			if(window.location.hash) location.hash = "";
			return nav(elHref);
		}else{
			console.log('Click');
		}
	}
};

document.addEventListener('DOMContentLoaded', function()  {
	front = document.getElementsByTagName("*");
	url = window.location.origin + urlDelimiter;
	currentUrl = window.location.href;
	currentScript = document.querySelector('script[src*="front.js"]');
	currentScriptUrl = currentScript.getAttribute("src");
	referrerUrl = document.referrer;
	baseUrl = app.getBaseUrl(currentUrl);

	if(!core.hasTemplateLayout()){

		currentScriptUrl = app.getBaseUrl(currentScript.src);
		console.log("wee "+currentScriptUrl);
		if (currentScript.hasAttribute("lib")) {
			var libs = currentScript.getAttribute("lib").split(";");
			for(lib in libs){
				require(libs[lib]);
			}
		}

		load = true;
	}
});

window.addEventListener('load', function() {
	if (load) {
		core.runLibPreloads();
		core.runFrontAttributes();
	}
});

window.addEventListener("hashchange", function() {
	return false;
}, false);

function require(src) {
	var el;

	if (src.indexOf("http") >= 0) {
		src = src;
		el = "script";
	}else if (src.indexOf(".js") >= 0) {
		src = baseUrl + src;
		el = "script";
	}else if(src.indexOf(".css") >= 0) {
		src = src;
		el = "link";
	}else{
		src = currentScriptUrl + "lib"+urlDelimiter+"front."+src+".js";
		el = "script";
	}

	var head = dom.get("head?tag"),
		asset = document.createElement(el);
		asset.src = src;
		asset.href = src;
		asset.rel = "stylesheet";

  	asset.onload = function () {
		console.log("Loaded: "+ src);
	};
	
	console.log(src);
	

	head.appendChild(asset);
  	//firstScript.parentNode.insertBefore(js, firstScript);
}

function scrollTo(element, to, duration) {
	if (duration < 0) return;
  		var difference = to - element.scrollTop,
  		perTick = difference / duration * 2;

		setTimeout(function() {
			element.scrollTop = element.scrollTop + perTick;
    		scrollTo(element, to, duration - 2);
		}, 10);
  
	console.log("Scroll: "+element+":"+to+":"+duration);
}

function redirect(url) {
	app.redirect(url);
}

function set(type, param, value){
	dom.set(type, param, value);
}

function getParentTag(element, tag) {
	while (element !== null) {
		if (element.tagName && element.tagName.toLowerCase() === tag) {
			return element;
		}
		element = element.parentNode;
	}

	return null;
};

function getObject(obj, name) {
	var objarr = "obj." + name;
	try {
		var obj = eval(objarr);
		return obj;
	}catch(err){
		return false;
	}
}

var core = function() {
	this.runLibPreloads = function() {
		for (i = 0; i < libPreload.length; i++) {
			if (libPreload[i].func)
				window[libPreload[i].func]();
		}
	}

	this.runFrontAttributes = function() {
		for (i = 0; i < front.length; i++) {
			core.runCoreAttributes(front[i]);
			core.runLibAttributes(front[i]);
		}
	}

	this.hasTemplateLayout = function() {
		for (i = 0; i < front.length; i++) {
			if (front[i].hasAttribute("template") && front[i].tagName == "SCRIPT") {
				var template = front[i].getAttribute("template");

				var count = currentScriptUrl.split("./").length + (template.match(/..\//g) || []).length;
				var url = currentUrl.split("/").slice(0, -count).join("/");

				var html = dom.get("html?tag=0");
				var script = dom.get("script?tag=0");

				console.log("Url: "+url);
				console.log("Count: "+count);
				console.log("CurrentScript: " + currentScriptUrl)

				script.removeAttribute("src");
				script.removeAttribute("template");
				var del = document.documentElement;
				del.parentNode.removeChild(del);

				var main = dom.removeTags(html.outerHTML, ['html','head','body']);
				
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var response = this.responseText;
						response = response.replace(/<base(.*)>/gi, '<base$1 href="'+url+'/">');
						response = response.replace(/<main(.*) include="(.*)">/gi, '<main$1>'+main);
						document.open();
						document.write(response);
						document.close();
					}
				};
				xhttp.open("GET", url+"/index.html", true);
				xhttp.send();

				return true;
			}
		}
	};

	this.runCoreAttributes = function(e){
		if(e.tagName == "BASE") {
			app.setupEnvironment(e);
		}
		if (e.hasAttribute("title") && e.tagName == "SCRIPT") {
			var value = e.getAttribute("title");
			document.title = (value) ? value : title;
		}
		if (e.hasAttribute("cache")){
			var value = e.getAttribute("cache");
			if (value == "no"){
				dom.create("meta", ["httpEquiv=Cache-Control", "content=no-cache,no-store,must-revalidate"], "head")
				dom.create("meta", ["httpEquiv=Pragma", "content=no-cache"], "head")
				dom.create("meta", ["httpEquiv=Expires", "content=0"], "head")
			}
		}
		if (e.hasAttribute("eventlistener")){
			var listener = e.getAttribute("eventlistener");
			var action = e.getAttribute("eventaction");
			
			window.addEventListener(listener, function() {
				eval(action);
			});
		}
		if (e.tagName == "TEMPLATE") {
			var fragments = core.toArray(dom.getChildren("template?tag"));
			var sorted = core.sortArray(fragments, "tagName");
			var array = core.tagArray(sorted);

			for (var i in array){
				var el = array[i].tagName+"?tag="+array[i].tagIndex;
				var index = array[i].getAttribute("index");

				if (array[i].tagIndex == index)
					dom.content(el, array[i].innerHTML);
			}
			core.runLibAttributesInElement(el);
		}
		if (e.hasAttribute("resizable"))
			e.style.resize = "both";
		if (e.hasAttribute("fixed"))
			e.style.position = "fixed";
		if (e.hasAttribute("hide") || e.hasAttribute("skip"))
			e.style.display = "none";
		if (e.hasAttribute("alert"))
			alert(e.getAttribute("alert"));
		if (e.hasAttribute("onload"))
			eval(e.getAttribute("onload"));
		if (e.hasAttribute("var") || e.hasAttribute("variable")) {
			var attr = e.getAttribute("var") || e.getAttribute("variable");
			var res = attr.split("=");
			frontVariables[res[0].toLowerCase()] = res[1];
		}
		if (e.tagName == "VAR")
			e.innerHTML = frontVariables[e.innerHTML.toLowerCase()];
		if (e.hasAttribute("property") && e.hasAttribute("content")) {
			
			var attr = e.getAttribute("content");
			//var increment = attr.split(";");
			//attr.innerText = ""

			//var increment = (variables) ? el.getAttribute("variable").split(";")[1] : 0;
			test = attr.replace(/{{ (.*?) }}/gi, "$1");
			var test2 = test.split(";");
			try{
				e.content = eval(test2[1]);
			}catch(err){}
			
		}
		if (e.hasAttribute("iterate") && e.hasAttribute("datasource") === false)
			core.runIteration(e);
		if (e.hasAttribute("trim"))
			e.innerHTML = e.innerHTML.trim();
		if (e.hasAttribute("lowercase"))
			e.innerHTML = e.innerHTML.toLowerCase();
		if (e.hasAttribute("uppercase"))
			e.innerHTML = e.innerHTML.toUpperCase();
		if (e.hasAttribute("escape")) {
			var escape = e.innerHTML;
			var code = escape.charCodeAt(0);

			if (0xD800 <= code && code <= 0xDBFF) {
				low = escape.charCodeAt(1);
				code = ((code- 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
			}

			e.innerText = "&#"+ code + ";";
		}
		if (e.hasAttribute("format")) {
			var format = e.getAttribute("format");
			var match = format.match(/\((.*)\)/gi);
			var res = match[0].slice(1,-1);
			var value = new Date(e.innerText);

			e.innerHTML = res.replace(/Y/gi, value.getFullYear())
				.replace(/M/gi, ('0'+value.getMonth()).substr(-2))
				.replace(/D/gi, ('0'+value.getDay()).substr(-2))
				.replace(/H/gi, ('0'+value.getHours()).substr(-2))
				.replace(/I/gi, ('0'+value.getMinutes()).substr(-2))
				.replace(/S/gi, ('0'+value.getSeconds()).substr(-2))
		}
		if (e.hasAttribute("decode")) {
			var decode = e.getAttribute("decode");
			e.innerHTML = '';
		}
		if (e.hasAttribute("delimiter")){
			var delimiter = e.getAttribute("delimiter");
			document.styleSheets[0].insertRule("nav.delimiter * a:after {content: '\\00a0 \\00a0"+delimiter+"\\00a0 \\00a0' !important}",0);
		}
		if (e.hasAttribute("slice")) {
			var slice = e.getAttribute("slice").replace(/\s+/g, '');
			var res = slice.split(",");
			e.innerHTML = e.innerHTML.slice(res[0],res[1]);
		}
		if(e.hasAttribute("poll")){
			var attr = e.getAttribute("poll");
			var interval = (attr > 1000) ? attr : 1000;
			
			//setTimeout(console.log('hej'), 2000);
			setInterval(function poll() {
				console.log(e);
				json(e);
				core.runCoreAttributesInElement(e);
				return poll;
			  }(), interval);
		}
		if(e.hasAttribute("if")) {
			var val = e.getAttribute("if");
			var term = val.split(";");
			if (term[0] == term[1]) {
				e.setAttribute(term[2], "");
			}
		}
	}

	this.runCoreAttributesInElement = function(e) {
		var e = (typeof e === 'string') ? dom.get(e) : e;
		els = e.getElementsByTagName("*");
		for (i = 0; i < els.length; i++) {
			core.runCoreAttributes(els[i]);
		}
	}
	
	this.runLibAttributesInElement = function(e) {
		var e = (typeof e === 'string') ? dom.get(e) : e;
		els = e.getElementsByTagName("*");
		
		for(k = 0; k < els.length; k++){
			for (j = 0; j < libAttribute.length; j++){
				if (els[k].hasAttribute(libAttribute[j].attr)) {
					window[libAttribute[j].func](els[k]);
				}
			}
		}
	}

	this.runLibAttributes = function(e){
		var e = (typeof e === 'string') ? dom.get(e) : e;
		for (j = 0; j < libAttribute.length; j++){
			if (e.getAttribute(libAttribute[j].attr)) {
				window[libAttribute[j].func](e);
			}
		}
	}
	
	this.rerunLibAttributes = function(attr){
		for (i = 0; i < front.length; i++)
			if(front[i].getAttribute(attr))
				window[attr](front[i]);
	}

	this.runIteration = function(element, start, stop){
		var attribute = element.getAttribute("iterate").split(";");
		var start = (start) ? start : 0;
		var stop = (stop) ? stop : attribute[0];

		dom.clone(element, "inside", (stop-start), attribute[1]);
	}

	this.setParam2 = function(uri, key, value) {
		return uri.replace(new RegExp("([?&]"+key+"(?=[=&#]|$)[^#&]*|(?=#|$))"), "&"+key+"="+encodeURIComponent(value)).replace(/^([^?&]+)&/, "$1?");
	}

	this.setParam = function(uri, key, value) {
		function upperToHyphenLower(match, offset, string) {
			console.log(match);
		  return (offset > 0 ? '-' : '') + match.toLowerCase();
		}
		return uri.replace(new RegExp("([?&]"+key+"(?=[=&#]|$)[^#&]*|(?=#|$))"), "&"+key+"="+encodeURIComponent(value)).replace(/^([^?&]+)&/, "$1?", upperToHyphenLower);
	  }

	this.getParams = function (url) {
		var url = (url) ? url : window.location.href;
	    var params = {};
	    var parser = document.createElement('a');
	    parser.href = url;
	    var query = parser.search.substring(1);
	    var vars = query.split('&');
        
        for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (!pair[1]) pair[1] = "";
		    params[pair[0]] = decodeURIComponent(pair[1] + "");
        }
        
		return params;
	};
	
	this.sortArray = function(array, propertyName){
		return array.sort(function(a, b){
			return a[propertyName].charCodeAt(0) - b[propertyName].charCodeAt(0);
		});
	}

	this.tagArray = function(array) {
		var current = null;
		var u = 0;
		for(j=0; j < array.length; j++) {
			
			attr = array[j].getAttribute('index');
			if (attr) {
				u = attr;
			}else{
				if (current != array[j].tagName) {
					current = array[j].tagName;
					u = 0;
				}else{
					u++;
				}
			}

			array[j].tagIndex = u;
		}
	
		return array;
	}

	this.toArray = function(obj){
		var arr = [];
		[].push.apply(arr, obj);
		return arr;
	}

	this.toDOM = function(str){
		return new DOMParser().parseFromString(str, "text/xml");
	}

	this.toObject = function(str){
		obj={};
    	var KeyVal = str.split(",");
    	for (i in KeyVal) {
    		KeyVal[i] = KeyVal[i].split(":");
    		obj[KeyVal[i][0]]=KeyVal[i][1];
		}
		return obj;
	}

	this.isJson = function(str) {
		try {
			JSON.parse(str);
			return true;
		}catch(err){
			return false;
		}
	}

	this.isString = function(obj){
		return Object.prototype.toString.call(obj) === "[object String]"
	}
}

var app = function() {

	var store = localStorage;
	var baseStartUrl;

	this.getBaseUrl = function(url) {
		str = url.split(urlDelimiter);
		str.pop();
		return str.join(urlDelimiter) + urlDelimiter;
	}

	this.getNewUrl = function(){
		var count = currentScriptUrl.split("./").length;
		return currentUrl.split("/").slice(0, -count).join("/");
	}

	this.setupEnvironment = function() {
		var isLocalDev = this.isLocalDev();
		var el = dom.get("base?tag");
		var attr = el.getAttribute("env").split(";");
		var env;
		for(a in attr){
			env = attr[a].split(":");
			if (env[0] == "local" && isLocalDev){
				dom.update("base?tag", ["setAttribute", "href", env[1]]);
				console.log("Running environment: localhost "+env[0]);
				return env;
			}else if(env[0] == "prod" && !isLocalDev){
				dom.update("base?tag", ["setAttribute", "href", env[1]]);
				console.log("Running environment: production "+env[0]);
				return env;
			}
		}
	}

	this.getBaseStartUrl = function() {
		return baseStartUrl;
	}

	this.setFrontBaseUrl = function(dir) {
		newBaseUrl = currentScriptUrl.split(urlDelimiter);
		newBaseUrl[3] = dir + urlDelimiter + newBaseUrl[3];
		currentScriptUrl = newBaseUrl.join(urlDelimiter);
		console.log("FrontBaseUrl changed: "+currentScriptUrl);
	}
	
	this.getPathUrl = function(url){
		return new URL(url).pathname;
	}

	this.storage = function(key, value) {
		if (key && value)
			store.setItem(key, value)
		else if(key && value === null)
			store.removeItem(key, value)
		else if(key == null && !value)
			store.clear()
		else if(key && value === undefined)
			return store.getItem(key)
	}
	
	this.isLocalDev = function() {
		if (baseUrl.match(/localhost|[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}|::1|\.local|^$/gi))
			return true;
		else
			return false;
	}

	this.redirect = function(url) {
		top.location.href = url;
	}

}

var dom = function() {

	var oldClass = '';

	this.get = function(obj) {
		var res = obj.split(elementDivider);
		if (res[1] === "tag"){
			var index = (res[2]) ? res[2] : 0;
			return document.getElementsByTagName(res[0])[index];
		}else if (res[1] === "name"){
			return document.getElementsByName(res[0]);
		}else{
			return document.getElementById(res[0])
		}
	}

	this.exists = function(obj) {
		var el = this.get(obj);
		if (typeof(el) !== 'undefined' && el != null)
			return true;
		else
			return false;
	}

	this.hide = function(obj) {
		var el = this.get(obj);
		if (el) el.setAttribute('style', 'display: none !important');
	}

	this.show = function(obj) {
		var el = this.get(obj);
		if (el) el.setAttribute('style', 'display: block !important');
	}

	this.toggle = function(obj) {
		var el = this.get(obj);
		var di = el.style.display;
		if (di == 'block' || di == '') this.hide(obj)
		else this.show(obj);
	}

	this.focus = function(obj) {
		var el = this.get(obj);
		if (el) el.focus();
	}

	this.remove = function(obj) {
		var el = this.get(obj);
		if (el) el.parentNode.removeChild(el);
	}

	this.content = function(obj, content) {
		var el = this.get(obj);
		if (el && (content || content === ""))
			el.innerHTML = content;
		else return el.innerHTML;
	}

	this.source = function(obj, source) {
		var el = this.get(obj);
		if (el && source) el.src = source;
		else return el.src;
	}

	this.value = function(obj, value) {
		var el = this.get(obj);
		if (el && value!= null) el.value = value;
		else return el.value;
	}

	this.placeholder = function(obj, value) {
		var el = this.get(obj);
		if (el && value!= null) el.placeholder = value;
		else return el.placeholder;
	}

	this.formvalues = function(obj) {
		var el = this.get(obj);
		var txt = "";
		var i;

		for (i = 0; i < el.length; i++) {
			txt = txt + el.elements[i].value + "<br>";
		}

		alert(txt);
	}

	this.width = function(obj, value) {
		var el = this.get(obj);
		if (el && value!= null) el.width = value;
		else return el.width;
	}

	this.height = function(obj, value) {
		var el = this.get(obj);
		if (el && value!= null) el.height = value;
		else return el.height;
	}

	this.dimension = function(obj, measure, value) {
		var el = this.get(obj);
		alert(el.width);
		if (el && value!= null) el.width = value;
		else return el.width;
		if (el && value!= null) el.height = value;
		else return el.height;
	}

	this.checked = function(obj) {
		var el = this.get(obj);
		if (el.checked) return true;
		else return false;
	}

	this.class = function(obj, action, classname) {

		var el = this.get(obj);

		try {
			var classVal = el.getAttribute("class");
			var bclass = el.getAttribute("bindclass");

			if (action == 'add') {
				el.classList.add(classname);
			}else if (action == 'remove') {
				el.classList.remove(classname);
			}else if (action == 'toggle') {
				el.classList.toggle(classname);
			}else if (action == 'update') {
				var bname = el.classList.item(bclass);
				console.log(bname);
				el.className = el.className.replace(bname, classname);
			}else if(action == 'reset') {
				el.classList.remove(classname);
				el.offsetWidth = el.offsetWidth; // fix
				el.classList.add(classname);
			}

		}catch(err){
			return false;
		}
	}

	this.click = function(obj) {
		var el = this.get(obj);
		el.click();
		return false;
	}

	this.reset = function(obj) {
		var el = this.get(obj);
		if (el) el.reset();
	}

	this.audio = function(obj, action) {
		var el = this.get(obj);
		if (action == 'play') {
			if (el) el.play()
		}else if(action == 'stop') {
			if (el) el.pause();
			if (el) el.currentTime = 0.0;
		}
	}
	
	this.update = function(el, arr) {
		var el = this.get(el);
		//console.dir(el);
		var props = "el."+arr[0]+"('"+arr[1]+"', '"+arr[2]+"')";
		if (el) eval(props);
	}

	this.create = function(el, arr, parent) {
		var el = document.createElement(el);
		for(i in arr) {
			var props = arr[i].split(/=(.+)/);
			eval("el."+props[0]+" = '"+props[1]+"'")
		}

		if(parent)
			document.getElementsByTagName(parent)[0].appendChild(el);
		else
			document.body.appendChild(el);
	}

	this.clone = function(el, parent, copies, variables) {
		var cln = el.cloneNode(true);
	
		if(parent === "head") {
			document.getElementsByTagName('head')[0].appendChild(cln)
		}else if(parent === "inside") {
			el.innerHtml = "";
			
			var elHtml = el.innerHTML;

			var html = "";
			var increment = (variables) ? el.getAttribute("variable").split("=")[1] : 0;

			for(var j=0; j < copies; j++) {
			
				if (variables) {
					elVarHtml = elHtml.replace(/<var>(.*)<\/var>|{{ (.*?) }}/gi, increment);
					html += elVarHtml;
				}else{
					html += elHtml;
				}

				increment++;
			}

			el.innerHTML = html;

		}else{
			document.body.appendChild(cln)
		}
	}

	/*this.insert = function (obj, create, html = '', pos = 1) {
		var node = document.createElement(create[0]);
		node.id = create[1];

		//alert(create[1]);
		//this.content(node, 'dddd');
		//var textnode = document.createTextNode(html);
		//node.appendChild(textnode);

		var el = this.get(obj);
		el.insertBefore(node, el.childNodes[0]);

		dom.content(create[1], 'Reload page to see this post!');

		scrollTo(document.body, el.offsetTop, 100);
		//document.getElementById(obj).appendChild(node);
	}*/
	
	this.copyText = function(el) {
		var el = this.get(el);
		if(document.selection) {
			var range = document.body.createTextRange();
			range.moveToElementText(el);
			range.select().createTextRange();
		}else if(window.getSelection) {
			var range = document.createRange();
			range.selectNode(el);
			window.getSelection().addRange(range);
		}
		document.execCommand("copy");
	}
	
	this.resize = function(el, value) {
		var el = this.get(el);
		el.style.resize = "both";
	}
	
	this.scrollInto = function(el,bool) {
		var target = this.get(el);
		if (!bool)
			target.scrollIntoView();
		else
			target.scrollTop = bool;
	}

	this.set = function(type, param, value){
		
		var el = event.target || event.srcElement;
		var res = el.getAttribute("bind").split(bindDivider);

		if (res[1]) {
			var resEl = this.get(res[0]);
			var attr = resEl.getAttribute(res[1]);
			resEl.setAttribute(res[1], core.setParam(attr, param, value));
			
			var func = resEl.getAttribute("datasourceonchange");
			window[func](resEl);

			//eval(func);

		}else {
			dom.content(el.name, value);
		}
	}

	this.getElementsByAttribute = function(attribute, context) {
		var i = 0, node = null, nodeArray = [], select = (context) ? context : front;

		while (node = select[i++]) {
		  if (node.hasAttribute(attribute)) nodeArray.push(node);
		}
	  
		return nodeArray;
	}

	this.getChildren = function(el) {
		var el = this.get(el);
		if(typeof(el['content']) !== 'undefined')
			return el.content.children;
		else if(typeof(el['children']) !== 'undefined')
			return el.children;
		else
			var i = 0, node, nodes = el.childNodes, children = [];
			while (node = nodes[i++]) {
				if (node.nodeType === 1) { children.push(node); }
			}
			return children;
	}

	this.removeTags = function(str, tags) {
		var rtags = "";
		for(i in tags){
			rtags += "<\\/?"+tags[i]+ "[^>]*>|";
		}
		var re = new RegExp(rtags,'gi');
		str = str.replace(re, '')
		return str;
	}
	
	return false;
}

var core = new core();
var app = new app();
var dom = new dom();
var _ = dom;