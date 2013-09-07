var geocoder;
var map;
var currentLocation;

function initialize() {
  geocoder = new google.maps.Geocoder();
  
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        zoom: 8,
        center: currentLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var marker = new google.maps.Marker({
          map: map,
          position: currentLocation
      });

    }, function(){
      alert('error');
    });
  }

}

function calculate() {
  var address = document.getElementById('address').value;
  
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });

      calculateDistances(currentLocation, results[0].geometry.location);


    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}



function calculateDistances(current, dest) {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [current],
      destinations: [dest],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, processData);

  function processData(data){
    document.getElementById('distance').innerHTML = data.rows[0].elements[0].distance.text;
  }
}

google.maps.event.addDomListener(window, 'load', initialize);