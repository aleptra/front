require('xhr');
require('popup');
require('nav');
require('json');
require('drag');

function onLoad() {
	if (app.isLocalDev()) {
		app.setBaseUrl("projects/media-streamer");
		app.setFrontBaseUrl("projects/media-streamer");
	}else{
		app.setBaseUrl("front");
		app.setFrontBaseUrl("front");
	};
}