/**
* @constructor
* Custructor function creating objects for Google Map UI manipulation
* @param {string} containerId value of id attribute where map should be initialized
*/
function MapUI(containerId){
	
	//Init map options
	var mapOptions = {
		zoom: 3,
		center: new google.maps.LatLng(50, 50),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	//Private instance variable referencing map object
	var map = new google.maps.Map(document.getElementById(containerId), mapOptions);

	//Private instance variables for destination location marker and current location
	var destinationMarker, currentLocation;

	/**
	* Private function which sets marker overlay on Google Maps
	* @param location {google.maps.LatLng} location where marker will be set
	* @param center {boolean=} optional parameter - will center map in that point if true
	* @returns {google.maps.Marker} newly created marker
	*/
	function setMapMarker(location, center){
		if (center){
			map.setCenter(location);
		}

		return new google.maps.Marker({
			map: map,
			position: location
		});
	}

	/**
	* Set new bounds for the map and fits it.
	* @param current {google.maps.LatLng} first point for the bound
	* @param dest {google.maps.LatLng} second point for the bound
	*/
	function setMapBounds(current, dest){
		var mapBounds = new google.maps.LatLngBounds();
		mapBounds.extend(current);
		mapBounds.extend(dest);
		map.fitBounds(mapBounds);
	}

	
	//Public functions

	var self = this;

	/**
	* Set a marker on the map and center it.
	* @param pos {google.maps.LatLng} point location
	*/
	self.setCurrentLocation = function(pos){
		currentLocation = pos;
		setMapMarker(pos, true);
	}

	/**
	* Set a second marker on the map and fits it to display both markers.
	* @param pos {google.maps.LatLng} point location
	*/
	self.setDestination = function(pos){
		//Remove previous destination
		if (destinationMarker){
			destinationMarker.setMap(null);
		}
		destinationMarker = setMapMarker(pos);

		if (currentLocation){
			setMapBounds(currentLocation, pos);
		}
	}

}