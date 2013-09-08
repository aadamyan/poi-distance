function POIDistanceModel(){
	var self = this;

	self.geolocationSupported = ko.observable();
	self.errorMessage = ko.observable();
	self.address = ko.observable();
	self.distance = ko.observable();
	self.destinationAddress = ko.observable();
	self.loading = ko.observable(false);

	var currentLocation;
	var mapAPI = new MapAPI();
	var mapUI = new MapUI('map-canvas');

	mapAPI.getCurrentLocation(function(result){
		if(!result.success){
			self.errorMessage(success.error.message);
			return self.geolocationSupported(false);
		}
		currentLocation = result.location;
		mapUI.setCurrentLocation(currentLocation);
	})

	self.search = function(){
		self.errorMessage('');
		if(!self.address()){
			return;
		}
		self.loading(true);

		mapAPI.getCurrentLocation(function(currentLoc){
			mapAPI.geocode(self.address(), function(poiLoc){
				if(!poiLoc.success){
					self.loading(false);
					return self.errorMessage(poiLoc.reason);
				}
				self.destinationAddress(poiLoc.address)
				mapAPI.calculateDistance(currentLoc.location, poiLoc.location, function(result){
					if(!result.success){
						self.loading(false)
						return self.errorMessage(result.reason);
					}
					self.distance(result.distance.text);
					mapUI.setDestination(poiLoc.location);
					self.loading(false);
				})
			})	
		})
		
	}

}