function MapAPI(){

	//Google Geocoder and Distance Matrix 
	var geocoder = new google.maps.Geocoder();
	var distanceService = new google.maps.DistanceMatrixService();
	var currentLocation = undefined;


	var self = this;

	self.getCurrentLocation = function(cb){
		if (currentLocation){
			return cb({success: true, location: currentLocation});
		}

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(pos){
				currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				cb({ success: true, location: currentLocation });
			}, function(err){
				cb({ success: false, error: err });
			});
		} else {
			cb({ success: false, error: { message: 'Your browser doesn\'t support HTML5 Geolocation API' } });
		}
	}

	self.calculateDistance = function(origin, dest, cb){

		var distanceQuery = {
			origins: [origin],
			destinations: [dest],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}

		distanceService.getDistanceMatrix(distanceQuery, function(result){
			var distance = result.rows[0].elements[0];

			if(distance.status == google.maps.DistanceMatrixStatus.OK){
				cb({success: true, distance: distance.distance});
			}else{
				cb({success: false, reason: 'Sorry, we couldn\'t calculate the distance', status: distance.status});
			}

		});
	}

	self.geocode = function(address, cb){
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				cb({success: true, location: results[0].geometry.location, address: results[0].formatted_address, raw: results});        
			} else {
				cb({success: false, reason: 'Sorry, we couldn\'t find anything', status: status});
			}
		});
	}

	
}
