
/**
* Constructor function used as knockout view model. Provides searching functionality in queries history
* using lunr.js as a client side FTS library
* @constructor
*/
function HistorySearchModel(){
	/**
	* lunr.js index object for indexing search queries that succeeded.
	* @type {lunr.Index}
	*/
	var index = lunr(function () {
	    this.field('query', {boost: 2});
	    this.field('address');
	    this.ref('id');
	});

	/**
	* Local storage of search queries. Used to get original queries based on ref number
	* @type {Array<Object>}
	*/
	var localStore = [];

	/**
	* Counter of search queries made
	* @type {number}
	*/
	var queryNumber = 0;

	var self = this;

	/**
	* knockout observable array used for displaying search results
	* @type {ko.observableArray} holding {Array<Object>} 
	*/
	self.history = ko.observableArray();
	
	/**
	* knockout observable variable used for capturing history search box
	* @type {ko.observable} holding {string} value 
	*/
	self.searchQuery = ko.observable();
	
	/**
	* knockout observable variable used for triggering no results message
	* @type {ko.observable} holding {boolean} value 
	*/
	self.noResultsFound = ko.observable(false);

	/**
	* Search indexing function of search queries. Adds new document to the lunr index.
	* @param query {string} original query made by user
	* @param address {string} formatted address returned by Google Geolocation API
	*/
	self.index = function(query, address){
		var doc = { id: queryNumber++, query: query, address: address };
		index.add(doc);
		localStore.push(doc);
	};

	/**
	* Search the lunr index by query from this.searchQuery().
	* Retrieved results are mapped to another array of actual queries using localStore
	*/
	self.search = function(){
		var searchResult = index.search(self.searchQuery());
		searchResult = $.map(searchResult, function(res){
			return localStore[res.ref];
		})
		self.noResultsFound(searchResult.length == 0);
		self.history(searchResult);
	};
}

function POIDistanceModel(){
	var self = this;

	/**
	* knockout observable variable used for displaying information about Geolocation API support by
	* current browser
	* @type {ko.observable} holding {boolean} value 
	*/
	self.geolocationSupported = ko.observable(true);

	/**
	* knockout observable variable used for displaying error messages
	* @type {ko.observable} holding {string} value 
	*/
	self.errorMessage = ko.observable();

	/**
	* knockout observable variable used for capturing address search box
	* @type {ko.observable} holding {string} value 
	*/
	self.address = ko.observable();

	/**
	* knockout observable variable used for displaying calculated distance
	* @type {ko.observable} holding {string} value 
	*/
	self.distance = ko.observable();

	/**
	* knockout observable variable used for displaying actual address(formatted) 
	* which was determined using Google Maps API 
	* @type {ko.observable} holding {string} value 
	*/
	self.destinationAddress = ko.observable();

	/**
	* knockout observable variable used for controlling loading spinner 
	* when there is a pending request
	* @type {ko.observable} holding {boolean} value with initial false value
	*/
	self.loading = ko.observable(false);

	/**
	* instance of HistorySearchModel used for indexing queries
	* @type {HistorySearchModel} 
	*/
	self.history = new HistorySearchModel();

	/**
	* instance of MapAPI used for getting current location, distance and geocoding
	* @type {MapAPI} 
	*/
	var mapAPI = new MapAPI();
	
	/**
	* instance of MapUI used for visualizing Google Maps with markers
	* @type {MapUI} 
	*/
	var mapUI = new MapUI('map-canvas');


	// Preload user's current location and visualize it on the map
	mapAPI.getCurrentLocation(function(result){
		if (!result.success){
			self.errorMessage(result.error.message);
			return self.geolocationSupported(false);
		}
		mapUI.setCurrentLocation(result.location);
	});

	/**
	* Error messages handling function, controls loading spinner and resets values (distance and address)
	* @param message {string} error message to display to the user
	* @param onlyDistance {boolean} if set to true(or truly value) will reset only distance
	*/
	function handleError(message, onlyDistance){
		self.loading(false);
		self.errorMessage(message);
		if (onlyDistance)
			return self.distance('');
		self.distance('');
		self.address('');
	}

	

	/**
	* Searching function, gets address from search box do following steps
	* <ul>
	* <li>gets user's current location</li>
	* <li>translates entered address to geolocation</li>
	* <li>calculates the distance between two points and displays to the user</li>
	* </ul>
	*/
	self.search = function(){
		var index = true;

		//if called from history 
		if(arguments[0] === false){
			self.address(arguments[1].query);
			index = false;
		}
		
		self.errorMessage('');
		if (!self.address()){
			return;
		}
		self.loading(true);

		mapAPI.getCurrentLocation(function(currentLoc){
			if (!currentLoc.success){
				self.errorMessage(currentLoc.error.message);
				return self.geolocationSupported(false);
			}
			mapAPI.geocode(self.address(), function(poiLoc){
				if (!poiLoc.success){
					return handleError(poiLoc.reason);
				}

				self.destinationAddress(poiLoc.address);
				mapUI.setDestination(poiLoc.location);

				//Index search query with formatted address result
				if (index)
					self.history.index(self.address(), poiLoc.address);
				
				mapAPI.calculateDistance(currentLoc.location, poiLoc.location, function(result){
					if (!result.success){
						return handleError(result.reason, true);
					}

					self.distance(result.distance.text);
					self.loading(false);
				});
			});	
		});
		
	};

	

}