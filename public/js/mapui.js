function MapUI(containerId){
	//Init map	
	var mapOptions = {
		zoom: 3,
		center: new google.maps.LatLng(50, 50),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById(containerId), mapOptions);

	var destinationMarker, currentLocation;


	function setMapMarker(location, center){
		if(center){
			map.setCenter(location);
		}
		return new google.maps.Marker({
			map: map,
			position: location
		});
	}

	function setMapBounds(current, dest){
		var mapBounds = new google.maps.LatLngBounds();
		mapBounds.extend(current);
		mapBounds.extend(dest);
		map.fitBounds(mapBounds);
	}

	
	//Public API
	var self = this;

	self.setCurrentLocation = function(pos){
		currentLocation = pos;
		setMapMarker(pos, true);
	}

	self.setDestination = function(pos){
		//Remove previous destination
		if(destinationMarker){
			destinationMarker.setMap(null);
		}

		destinationMarker = setMapMarker(pos);
		if(currentLocation){
			setMapBounds(currentLocation, pos);
		}
	}

}