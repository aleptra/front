libAttribute.push(
	{'attr': 'include', 'func': 'include'}
);

function include(el){
	var target = el.getAttribute("include");
	client.get(globalUrl + target, function(response) {
		if (response) {
			el.innerHTML = response;
			core.runCoreAttributesInElement(el);
			core.runLibAttributesInElement(el);
		}
	});
}

var xhrQuick = function() {

	var request = new XMLHttpRequest();
	var headers = [];
	var credentials = false;
	var responseHeaders;

	this.addHeader = function(header, value) {
		headers.push([header, value]);
	}

	this.getResponseHeader = function(header) {
		return decodeURI(escape(request.getResponseHeader(header)));
	}

	this.get = function(url, callback, async) {
		var async = async ? async : true;
		request.open("GET", url, async);

		if (credentials) {
			request.withCredentials = true;
		}

		if (headers) {
			for (var i in headers) {
				request.setRequestHeader(headers[i][0], headers[i][1]);
			}
			headers.length = 0; // clear header array after request
		}

		request.onload = function() {
			//console.log("%c API (GET): "+this.responseText, "background: green; color: white");
    		callback(this.responseText);
		};

		request.onloadstart = function() {
			if (elprogress) navLoader()
		}

		request.onerror = function() {
			//callback("error");
		}

		request.ontimeout = function(e) {
			//callback("timeout");
		};

		request.send(null);
  }

  this.post = function(url, data, callback) {

		request.open("POST", url, true);
		request.setRequestHeader('Content-Type', 'application/json');

		request.onload = function() {
			callback(this.responseText);
			console.log("%c API (Response): "+this.responseText, "background: blue; color: yellow");
		}

		console.log("%c API (POST): "+JSON.stringify(data), "background: green; color: white");
		request.send(JSON.stringify(data));
  }
}

var socket = new xhrQuick();
var client = new xhrQuick();