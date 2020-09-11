function onLoad() {
	
	if (app.isLocalDev()) {
		app.setBaseUrl("projects/front");
		app.setFrontBaseUrl("projects/front");
	}else{
		app.setBaseUrl("front");
		app.setFrontBaseUrl("front");
	};

}