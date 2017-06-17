
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.html("");

    // Get search input
    var street = $("#street").val().split(' ').join('+');
    var city = $("#city").val().split(' ').join('+');

    console.log("street is " + street)

    // load streetview
    var searchurl = "http://maps.google.com/maps/api/geocode/json?address=" + street + "," + city
    $.ajax({
      url: searchurl
    })
      .done( function ( data ) {
        var o = data["results"][0]["geometry"]["location"];
        console.log("search results was: Latitude: " + o["lat"] +", Longitude: " + o["lng"]);
        $("#bgimage").css("background-image",
                  'url("http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' +
                  o["lat"] + "," + o["lng"] + '&heading=240.78&pitch=20")'
                  )
      });

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "1e4c2f6c5bb64b708f808963b73191f1",
      'q': street + " " + city
    });
    // $.getJSON(url, function( data ){
    //   console.log("Got data from NYT: ");
    //   var docs = data["response"]["docs"]
    //   console.log(docs.length);
    //   var wants = ["web_url", "snippet", "type_of_material"];
    //   var items = [];
    //   // First we iterate over the document objects
    //   for (var i = 0 ; i < docs.length ; i++){
    //     console.log(docs[i]);
    //     // Next we iterate over the contents in the object
    //     $.each(docs[i], function(index, content){
    //       // Filter out where content is null
    //       if (content !== null){
    //         // We filter out the things we want
    //         if ($.inArray(index, wants) !== -1){
    //           console.log(index + content);
    //           // And append it to the items list
    //           items.push( "<li id='" + index + "'>" + content + "</li>" );
    //         }
    //       }
    //     });
    //   };
    //   // Finally after getting the data, we append it to the document
    //   $( "<ul/>", {
    //   "class": "my-new-list",
    //   html: items.join( "" )
    //   }).appendTo( "#nytimes-articles" );
    //   console.log("for loop ok");
    // }).error(function(e){
    //   console.log("An error occured!");
    //   $( "<h2/>", {
    //     html:( "An error occured!" )
    //   }).appendTo( "#nytimes-articles" );
    // });

    // Wikipedia AJAX!
    var wurl = "https://en.wikipedasdasdasdasdfia.org/w/api.php?action=opensearch&search="+ city +"&format=json"

    var wikitimeout = 
    $.ajax({
        url: wurl,
        dataType: "jsonp",
        success: function(data){
          var items = []
          console.log("Got data from wikipedia!");
          // We iterate through the data back
          for ( var i = 1 ; i < data.length ; i++ ) {
            console.log(data[i][0]);
            // And append it to items array
            items.push( "<li>" + data[i][0] + "</li>" );
          }
          // Finally after getting the data, we append it to the document
          $( "<ul/>", {
          html: items.join( "" )
          }).appendTo( "#wikipedia-links" );
        }
      })
        .error(function(e){
        console.log("An error occured when quering wikipedia!");
        console.log(e);
      });
    return false;
};

$('#form-container').submit(loadData);
