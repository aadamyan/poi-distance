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

	function handleError(message, onlyDistance){
		self.loading(false);
		self.errorMessage(message);
		if(onlyDistance)
			return self.distance('');
		self.distance('');
		self.address('');
	}

	self.search = function(){
		self.errorMessage('');
		if(!self.address()){
			return;
		}
		self.loading(true);

		mapAPI.getCurrentLocation(function(currentLoc){
			mapAPI.geocode(self.address(), function(poiLoc){
				if(!poiLoc.success){
					return handleError(poiLoc.reason);
				}
				
				self.destinationAddress(poiLoc.address)
				mapUI.setDestination(poiLoc.location);

				mapAPI.calculateDistance(currentLoc.location, poiLoc.location, function(result){
					if(!result.success){
						return handleError(result.reason, true);
					}

					self.distance(result.distance.text);
					self.loading(false);
				})
			})	
		})
		
	}

}