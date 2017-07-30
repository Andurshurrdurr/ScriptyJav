// Here we add our locations
var locations = [
  {id: 1, title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {id: 2, title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {id: 3, title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {id: 4, title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {id: 5, title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {id: 6, title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// Map and polygon as global variables
var map;
// For Foursquare API
var foursquareClientID = "BVZ2KL4UKK0IB1CGRXGTISJYDABEUOM4L22NAD3254UCRWRG";
var foursquareClientSecret = "3VB2Y10IVTA1VYICIB5ORQKBYP4LOKWD0RZSVKFF0OWH2NFF";
// For our modal
var modal = document.getElementById('myModal');

// Helperfunction for creating text for the infowindow
var makeContent = function(location){
  // First we format the content to html
  var content = '<div class="infoWindow"><h3>' + location.title + '</h3>' +
  '<div class="infoContent">' + location.website + '</div>' +
  '<div class="infoContent">' + location.address + '</div>' +
  '<div class="infoContent">' + location.phone + '</div></div>';
  // And return the content
  return content;
}


// Function called when location is clicked
function locationClicked (location) {
  // First we display the infowindow
  location.displayInfo()
  thread_id = location.id;
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
  self.id = location.id;
  self.title = location.title;
  self.lat = location.location.lat;
  self.lng = location.location.lng;

  // And sets some empty values we will fill with API requests
  self.website = "www.google.com";
  self.address = "Villaveien";
  self.phone = "1289378";

  // And observable to toggle the location and dropdown visible
  self.visible = ko.observable(true);
  self.inPolygon = ko.observable(true);
  self.showDropdown = ko.observable(false);

  // And we create a webservice url from the data, which we will request
  var foursquareURL = "https://api.foursquare.com/v2/venues/search?ll=" +
  self.lat + "," + self.lng + "&client_id=" + foursquareClientID +
  "&client_secret=" + foursquareClientSecret + "&v=" + "20172307" +
  "&query=" + self.title
  console.log()

  // Next we do the AJAX request using getJSON - uncommented for now to reduce requests

  // $.getJSON(foursquareURL)
  //   // Do the responsehandler
  //   .done(function( data ){
  //     // Get the response
  //     var response = data.response.venues[0];
  //     // Check if response is anything
  //     if (response) {
  //       // Do a nice formatting using if statement shorthand
  //       console.log("accessed the foursquareURL")
  //       self.website = response.url ? response.url : "No website";
  //       self.address = response.formattedAddress ? response.formattedAddress[0] : "No formatted address";
  //       self.phone = response.contact.formattedPhone ? response.contact.formattedPhone : "No phone number";
  //     } else {}
  //   })
  //   // And finally an error handler if our request fails
  //   .fail(function( jqxhr, textStatus, error ) {
  //     var err = textStatus + ", " + error;
  //     console.log( "Request Failed: " + err );
  // });

  // Then make the infowindow and marker for google maps
  setTimeout(function () {
    self.infoWindow = new google.maps.InfoWindow({content: makeContent(self)});
  }, 1000);

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
  self.displayInfo = function (){
    loclist().forEach(function(location){
      location.infoWindow.close();
      location.showDropdown(false);
    });
    self.infoWindow.open(map, self.marker);
    self.showDropdown(true);
  }

  // And finally listener for when user clicks the marker
  self.marker.addListener('click', function(){
    locationClicked(self);
  });
};

// This is our viewmodel--------------------------------------------------------


var ViewModel = function () {
  // First we set the self variable
  var self = this;
  // Then we initiate a couple of attributes for search and locations
  self.searchInput = ko.observable("");
  self.locationList = ko.observableArray([]);
  self.currentThread = ko.observable(0);
  // Next we get the map object
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    styles: mapstyles,
    mapTypeControl: false
  });

  // initialize location markers and push them to the locationlist obs array
  locations.forEach(function(location){
		self.locationList.push(new Location(location, self.locationList));
	});

  self.toggleDrawing = function(){
    console.log("Drawing toggled!")
    if (drawingManager.map) {
      drawingManager.setMap(null);
      // Shorthand for loop to set locations visible
      for (var i in drawingManager.searchLocs){
        drawingManager.searchLocs[i].inPolygon(true);
      }
      // In case the user drew anything, get rid of the polygon
      if (polygon !== null) {
        polygon.setMap(null);
      }
    } else {
      drawingManager.setMap(map);
      console.log("setting locs" + self.filteredLocations());
      drawingManager.searchLocs = self.filteredLocations();
    }
  };

  // Filter: The function will return array of locations filtered by searchInput.
  // Knockout doesnt give documentation on their utilfunctions, but I found this
  // guide:
  // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
  self.filteredLocations = ko.computed(function() {
    // First we make our searchinput lowercase
    var filter = self.searchInput().toLowerCase();
    // Next we use the ko.utils.arrayFilter function and return the result
    return ko.utils.arrayFilter(self.locationList(), function(location) {
        // if drawingmanager enabled we check if visible is false, else its inactive
    		var title = location.title.toLowerCase();
    		var result = (title.search(filter) >= 0);
        if (location.inPolygon() === false){
          result = false;
        }
    		location.visible(result);
    		return result;
			});
  }, self);
  // setTimeout function so the google maps libs can load before we access them
}

// Callback for loading the google api
function initApp() {
  ko.applyBindings(new ViewModel());
}

// This is an errorhandler called if loading the google api fails
function errorHandler() {
  alert("Google maps has failed to load.")
}
