/**
* Constructor function - provides functionality for determining user's current location,
* geocoding from address to geo points and calculating distance between two points using
* Google Maps API
* @constructor 
*/
function MapAPI(){

	/**
	* instance of Google Geocoder 
	* @type {!google.maps.Geocoder}
	* @private
	*/
	var geocoder = new google.maps.Geocoder();
	
	/**
	* instance of Google DistanceMatrixService 
	* @type {!google.maps.DistanceMatrixService}
	* @private
	*/
	var distanceService = new google.maps.DistanceMatrixService();

	/**
	* Current location of the user
	* @type {google.maps.LatLng|undefined}
	* @private
	*/
	var currentLocation = undefined;


	var self = this;

	/**
	* Gets user's current location using HTML5 Geolocation API if capable browser.
	* @param cb {function} callback function called when location is deremined or when it was not possible 
	*/
	self.getCurrentLocation = function(cb){
		if (currentLocation){
			return cb({success: true, location: currentLocation});
		}

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(pos){
				currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				cb({ success: true, location: currentLocation });
			}, function(err){
				cb({success: false, error: err});
			});
		} else {
			cb({success: false, error: {message: 'Your browser doesn\'t support HTML5 Geolocation API'}});
		}
	}

	/**
	* Calculates approximate walking distance between two geo points in metric system using Google Distance Matrix Service.
	* @param origin {google.maps.LatLng} origin point location 
	* @param dest {google.maps.LatLng} destination point location
	* @param cb {function} callback function called on service call response
	*/
	self.calculateDistance = function(origin, dest, cb){

		var distanceQuery = {
			origins: [origin],
			destinations: [dest],
			travelMode: google.maps.TravelMode.WALKING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		};

		distanceService.getDistanceMatrix(distanceQuery, function(result){
			var distance = result.rows[0].elements[0];

			if (distance.status == google.maps.DistanceMatrixStatus.OK){
				cb({ 
					success: true, 
					distance: distance.distance 
				});
			} else {
				cb({ 
					success: false, 
					reason: 'Sorry, we couldn\'t calculate the distance', 
					status: distance.status 
				});
			}

		});
	}

	/**
	* Retrieves geolocation for provided address using Google Geolocation API.
	* @param address {string} address used for querying Google API
	* @param cb {function} callback function called on api call response
	*    passed object contain success:boolean, location:google.maps.LatLng, address:string, raw:Object
	*
	*/
	self.geocode = function(address, cb){
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				cb({
					success: true, 
					location: results[0].geometry.location, 
					address: results[0].formatted_address, 
					raw: results 
				});        
			} else {
				cb({ 
					success: false, 
					reason: 'Sorry, we couldn\'t find anything', 
					status: status 
				});
			}
		});
	}

	
}
