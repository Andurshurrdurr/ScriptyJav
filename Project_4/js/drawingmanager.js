var polygon = null;
var drawingManager;
// setTimeout function so the google maps libs can load before we access them
setTimeout(function () {
    drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });
  console.log(drawingManager)

  drawingManager.addListener('overlaycomplete', function(event) {
    // First, check if there is an existing polygon.
    // If there is, get rid of it and remove the markers
    console.log("Overlay is complete!")
    // Switching the drawing mode to the HAND (i.e., no longer drawing).
    drawingManager.setDrawingMode(null);
    // Creating a new editable polygon from the overlay.
    polygon = event.overlay;
    polygon.setEditable(false);
    // Searching within the polygon.
    searchWithinPolygon(polygon, drawingManager.searchLocs);
    // Make sure the search is re-done if the poly is changed.
    polygon.getPath().addListener('set_at', searchWithinPolygon);
    polygon.getPath().addListener('insert_at', searchWithinPolygon);
  });
}, 1000);

setTimeout(function () {
    console.log(drawingManager)
}, 1200);


// polygon <-> markers --- Iterate over markers
function searchWithinPolygon(polygon, locations) {
  for (var i = 0; i < locations.length; i++) {
    var position = new google.maps.LatLng(locations[i].lat, locations[i].lng)
    if (google.maps.geometry.poly.containsLocation(position, polygon)) {
      locations[i].visible(true);
    } else {
      locations[i].visible(false);
    }
  }
}
