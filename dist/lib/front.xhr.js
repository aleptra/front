/**
 * @param {string} target - Target DOM element.
 * @param {string or object} response - Response from XHR.
 * @param {string} doa - Do the action with the target.
 */
function doOnSuccess(target, response, doa) {

	var obj = '';

	if(response) {
    try {
			obj = JSON.parse(response)
    }catch(e) {
    	//console.log(e);
    }
	}

console.log("%c Do On Success (XHR Response): Target="+target+", Type="+doa, "background: yellow; color: black");

	hideLoader(target);

	arr = getAttributes('onsuccess');

	for (i = 0; i < arr.length; i++) {
		var str = arr[i][0];
		var firstchar = str.substring(0,1);

		if (firstchar == "*") { //global call
			str = str.substring(1); // remove char
		}

 		var values = str.split(") ");
		var valueAction = values[1];

		console.log(str);

		var value = values[0].split(":");
		var value1 = value[0].substr(1);
		var value2 = value[1];

		var object = getObject(obj, value1); //returns from xhr

		if (object) {
			if ((value2.length > 0 && value2 == object) || value2.length == 0)
					setTimeout(valueAction, 1);
		}

	}
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

	this.get = function(url, callback) {
		request.open("GET", url, true);

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

/**
 * @param {string} path - Path to XHR Controller (see xhr.php).
 * @param {string or objects} data - If data is passed use client.post.
 * @param {string} el - Target DOM Element.
 * @param {string} doa - Pass arguments to DoOnSuccess function.
 */
function xhr(path, data, el, doa) {

	var doa = (doa) ? null : doa;
	var target = (el.id) ? el.id : el;
	
	if (data == 'xhrpost') {
		xhrpost = getAttributes('xhrpost');
		post = eval(xhrpost[0][0]);
		data = [];
		data.push(post);
		//console.log("dataRaw", dom.value('q'));
	}

//console.log("dataRaw", dom.value('q'));

	var url = '/?xhr='+path;
	var code = 503;

	var orgcontent = dom.content(target);

	if (orgcontent){
		dom.class(target, "add", "disabled");
		dom.content(target, "<img src='/img/loader.gif' style='filter: brightness(0) invert(1)'>");
	}

	if (data) {

		for (var i in data) {
			data[i] = encodeURIComponent(data[i]);
		}

		client.post(url, data, function(response) {

			try {
				code = JSON.parse(response).code;
			}catch(err) {
				console.log('Error: '+err);
			}

		if (response)
			dom.class(target, "remove", "disabled");
			dom.content(target, orgcontent);
		});

	}else{
		client.get(url, function(response) {
		if (response)
			dom.class(target, "remove", "disabled");
			dom.content(target, orgcontent);
		});
	}

	return false;
}

var socket = new xhrQuick();
var client = new xhrQuick();