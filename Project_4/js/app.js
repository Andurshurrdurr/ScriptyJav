// Here we add our locations
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// And map as a global variable
var map;

// Helperfunction for creating text for the infowindow
var makeContent = function(location){
  return "Title: " + location.title
}

// Function called when location is clicked
function locationClicked (location) {
  // First we display the infowindow
  location.displayInfoWindow()
  // And bounce the marker
  location.marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout( function() {
    location.marker.setAnimation(null);
  },700);
}

// Out location class
var Location = function(location, loclist) {
  // First we set the self variable
  var self = this;
  // Next we initiate all the initial attributes
  self.title = location.title;
  self.lat = location.location.lat;
  self.lng = location.location.lng;

  // And sets some empty values we will fill with API requests
  self.URL = "";
  self.street = "";
  self.city = "";
  self.phone = "";

  // And an observable to toggle the location visible
  self.visible = ko.observable(true);

  // And we create a webservice url from the data, which we will request

  // Next we do the AJAX request

  // Then make the infowindow and marker for google maps
  self.infoWindow = new google.maps.InfoWindow({content: makeContent(self)});

  self.marker = new google.maps.Marker({
    map: map,
    title: self.title,
    position: new google.maps.LatLng(self.lat, self.lng),
    animation: google.maps.Animation.DROP,
  })

  // And we create the operators for showing marker
  self.markerVisible = ko.computed(function() {
    return self.visible() ? self.marker.setMap(map) : self.marker.setMap(null);
  });

  // Function for clearing infowindows
  self.displayInfoWindow = function (){
    loclist().forEach(function(location){
      location.infoWindow.close();
    });
    self.infoWindow.open(map, self.marker);
  }

  // And finally listener for when user clicks the marker
  self.marker.addListener('click', function(){
    locationClicked(self);
  });
};

// This is our viewmodel
var ViewModel = function () {
  // First we set the self variable
  var self = this;
  // Then we initiate a couple of attributes
  self.searchInput = ko.observable("");

  self.locationList = ko.observableArray([]);

  // Next we get the map object
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    styles: mapstyles,
    mapTypeControl: false
  });

  // Forsquare API

  // initialize location markers and push them to the locationlist obs array
  locations.forEach(function(location){
		self.locationList.push(new Location(location, self.locationList));
	});

  // Filter: The function will return array of locations filtered by searchInput.
  // Knockout doesnt give documentation on their utilfunctions, but I found this
  // guide online:
  // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
  self.filteredLocations = ko.computed( function() {
    // First we make our searchinput lowercase
    var filter = self.searchInput().toLowerCase();
    // Next we use the ko.utils.arrayFilter function and return the result
    return ko.utils.arrayFilter(self.locationList(), function(location) {
    		var string = location.title.toLowerCase();
    		var result = (string.search(filter) >= 0);
    		location.visible(result);
    		return result;
			});
  }, self);
  // Getting the map element in html
}

// Callback for loading the google api
function initApp() {
  ko.applyBindings(new ViewModel());
}

// This is an errorhandler called if loading the google api fails
function errorHandler() {
  alert("Google maps has failed to load.")
}
