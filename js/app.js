// We begin by adding our locations
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// Map and polygon as global variables
var map;
// For Foursquare API
var foursquareClientID = 'BVZ2KL4UKK0IB1CGRXGTISJYDABEUOM4L22NAD3254UCRWRG';
var foursquareClientSecret = '3VB2Y10IVTA1VYICIB5ORQKBYP4LOKWD0RZSVKFF0OWH2NFF';
// For our modal
var modal = document.getElementById('myModal');

// Lets get som gifs!
var numGifs = 25;
var giphyurl = 'https://api.giphy.com/v1/gifs/search?api_key=1d34a409c28f4202a1c4cf94dbd4676b&q=NewYork&limit=' +
                numGifs + '&offset=0&rating=G&lang=en';
var gifs = [];
var giphyError = "";

$.getJSON(giphyurl)
  .done(function (data) {
    gifs = data.data;
  })
  .fail(function(jqxhr, textStatus, error){
    var err = textStatus + ", " + error;
    console.log("Giphy request failed : " + err);
    // alert("Giphy API request failed");
    gifs = false;
  });

// Helperfunction for creating text for the infowindow
var makeContent = function (location) {
  // Get a random gif from our giphy api call
  var gifcontent = "";
  if (gifs) {
    var gifnum = Math.round(Math.random() * (numGifs - 1));
    var gifsrc = (gifs[0] === undefined) ? '' : gifs[gifnum].embed_url;
    gifcontent = '<div class="infoContent" style="text-align: center;"><i>'+
    '(The gif is just for fun &#9786;)</i></div><iframe src="' +
    gifsrc + '" alt="GIFFF" frameBorder="0"></iframe>';
  } else {
    gifcontent = '<div class="infoContent" style="text-align: center;"><i>' +
    'A failure occured in loading the fun gifs :(</i>';
  }
  // First we format the content to html
  var content = '<div class="infoWindow"><h3>' + location.title + '</h3>' +
  gifcontent + '<div class="infoContent">' + location.website() + '</div>' +
  '<div class="infoContent">' + location.address() + '</div>' +
  '<div class="infoContent">' + location.phone() + '</div>' +
  '<div class="infoContent">' + location.foursquareError() + '</div></div>';
  // And return the content
  return content;
};

// Function called when location is clicked
function locationClicked (location) {
  // First we display the infowindow
  location.displayInfo();
  thread_id = location.id;
  // And bounce the marker
  location.marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function () {
    location.marker.setAnimation(null);
  },700);
}

// Out location class
var Location = function (location, loclist, marker = '') {
  // First we set the self variable
  var self = this;
  // Next we initiate all the initial attributes
  self.title = location.title;
  self.lat = location.location.lat;
  self.lng = location.location.lng;
  // And sets some empty values we will fill with API requests
  self.website = ko.observable('No website');
  self.address = ko.observable('No formatted address');
  self.phone = ko.observable('No phone number');
  self.foursquareError = ko.observable('');
  // And observable to toggle the location and dropdown visible
  self.visible = ko.observable(true);
  self.inPolygon = ko.observable(true);
  self.showDropdown = ko.observable(false);
  // And we create a webservice url from the data, which we will request
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
  self.lat + ',' + self.lng + '&client_id=' + foursquareClientID +
  '&client_secret=' + foursquareClientSecret + '&v=' + '20172307' +
  '&query=' + self.title;

  // Next we do the AJAX request to foursqare using getJSON
  $.getJSON(foursquareURL)
    // Do the responsehandler
    .done(function (data) {
      // Get the response
      var response = data.response.venues[0];
      // Check if response is anything
      if (response) {
        // Do a nice formatting using if statement shorthand
        self.website(response.url ? response.url : 'No website');
        self.address(response.formattedAddress ? response.formattedAddress[0] : 'No formatted address');
        self.phone(response.contact.formattedPhone ? response.contact.formattedPhone : 'No phone number');
      }
    })
    // And finally an error handler if our request fails
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Foursqure request failed: " + err );
      // alert("Foursquare api request failed.  No data on locations.");
      self.foursquareError("A failure occured in loading Foursquare data :(");
  })
  .always(function(){
    // always make the infowindow and marker for google maps
    self.infoWindow = new google.maps.InfoWindow({content: makeContent(self)});
  });

  self.marker = new google.maps.Marker({
    map: map,
    title: self.title,
    icon: marker,
    position: new google.maps.LatLng(self.lat, self.lng),
    animation: google.maps.Animation.DROP
  });

  // And we create the operators for showing marker
  self.markerVisible = ko.computed(function () {
    return self.visible() ? self.marker.setMap(map) : self.marker.setMap(null);
  });

  // Function for clearing infowindows
  self.displayInfo = function () {
    var toggleDropdown = !self.showDropdown();
    loclist().forEach(function (location) {
      location.infoWindow.close();
      location.showDropdown(false);
    });
    self.infoWindow.open(map, self.marker);
    self.showDropdown(toggleDropdown);
  };

  // And finally listener for when user clicks the marker
  self.marker.addListener('click', function () {
    locationClicked(self);
  });
};

// This is our viewmodel -------------------------------------------------------
var ViewModel = function () {
  // First we set the self variable
  var self = this;
  // Then we initiate a couple of attributes for search and locations
  self.searchInput = ko.observable('');
  self.currentThread = ko.observable(0);
  self.locationList = ko.observableArray([]);
  // Observable for startlocation
  self.selectedStart = ko.observable('');
  // Next we get the map object
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    styles: mapstyles,
    mapTypeControl: false
  });

  // initialize location markers and push them to the locationlist obs array
  locations.forEach(function (location) {
    self.locationList.push(new Location(location, self.locationList));
  });

  // init locations for startlocation
  var marker = 'https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-09-128.png';

  // Drawingmanager
  self.toggleDrawing = function () {
    if (drawingManager.map) {
      // In case the user drew anything, get rid of the polygon
      if (polygon !== null) {
        polygon.setMap(null);
      }
      drawingManager.setMap(null);
      // Shorthand for loop to set locations visible
      for (var i in drawingManager.searchLocs) {
        if (drawingManager.searchLocs[i]){
          drawingManager.searchLocs[i].inPolygon(true);
        }
      }
    } else {
      drawingManager.setMap(map);
      console.log("setting locs" + self.filteredLocations());
      drawingManager.searchLocs = self.filteredLocations();
    }
  };

  // Function for getting the place searched for through api
  self.searchPlaces = function () {
    var places = searchBox.getPlaces();
    if (places.length === 0) {
      alert('We did not find any places matching that search!');
    } else {
      // And we construct a location from the place
      var icon = {
        url: places[0].icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      var searchLoc = {title: places[0].formatted_address,
                       location: {lat: places[0].geometry.location.lat(),
                                  lng: places[0].geometry.location.lng()}
                      };
      self.selectedStart() ? self.selectedStart().visible(false) : void(0);
      self.selectedStart(new Location(searchLoc, self.locationList, icon));
    }
  };

  // Function to toggle the side panel
  self.toggleNav = function () {
    var sidepanel = $('.side-panel');
    var overlay = $('#google-map-overlay');
    if (sidepanel.css('width') === '320px') {
      overlay.css('opacity', '0');
      sidepanel.css('width', '0px');
      sidepanel.css('padding', '0px');
    } else {
      overlay.css("opacity", '0.5');
      sidepanel.css("width", "320px");
      sidepanel.css("padding", "20px 10px 30px 10px");
    }
  };
  // DirectionsService
  self.getRoute = function () {
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(self);
  };
  self.resetRoute = function () {
    directionsDisplay.setMap(null);
  };
  // Filter: The function will return array of locations filtered by searchInput.
  // Knockout doesnt give documentation on their utilfunctions, but I found this
  // guide:
  // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
  self.filteredLocations = ko.computed(function () {
    // First we make our searchinput lowercase
    var filter = self.searchInput().toLowerCase();
    // Next we use the ko.utils.arrayFilter function and return the result
    return ko.utils.arrayFilter(self.locationList(), function(location) {
      // if drawingmanager enabled we check if visible is false, else its inactive
      var title = location.title.toLowerCase();
      var result = (title.search(filter) >= 0);
      if (location.inPolygon() === false) {
        result = false;
      }
      location.visible(result);
      return result;
    });
  }, self);
};

function initKnockout () {
  ko.applyBindings(new ViewModel());
}

// Callback for loading the google api
function initApp () {
  initKnockout();
  initMap();
}

// This is an errorhandler called if loading the google api fails
function errorHandler() {
  alert("Google maps has failed to load.");
}
