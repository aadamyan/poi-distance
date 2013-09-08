poi-distance
============

Simple web app for estimating distance between current location and point of interest.


### External dependencies

* Google Geolocation API - used for translating user's entered address to geographical points
* Google DistanceMatrixService (Google Maps API) - used for estimating distance between two points
* Google Maps - for visualizing current and point of interest


### Functionality & features

* Geolocation API support/availability detection and informing to the user
* Searching by address using Google services
* Automatically map zoom and centering to fit both points (current and destination)
* Displaying formatted address based on query result
* Displaying estimated distance between two points
* Saving queries history and search ther using client side FTS library
* Location from history by clicking results list

### Technologies used

* __Node.js__ application environment/framework
* __express__ web framework
* __Jade__ templating language
* __Knockout.js__ front-end javascript library
* __jquery__ not necessary (at this moment only used for cross-browser Array map functionality)
* __lunr.js__ client side full text search
* __twitter bootstrap__ css framework


### Future improvements

* Right now only first result is used from results returned by Google Geolocation API when translating address to lat/lng. Application can provide list of mathed places to user.
* Search history is not persisted/saved on server side and is lost after page refresh. Server side search engine could be used (e.g ElasticSearch) and connected with the client using ajax requests. 
* Distance calculated is for walking which means that trans-oceanic distances are not supported. Possible solution in such cases could be calculating directly based on geo coordinates.
* Displaying time when search was made in search history



