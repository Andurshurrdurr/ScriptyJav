# ScriptyJav
This project features the use of APIs and the MVVM design pattern for creating a functional geolocation application based on google maps.  

### Features
- Google maps JavaScipt API
  * Places -> search and autocomplete to find a place on the map
  * Directions service to find the fastest route through positions on the maps
  * Drawingmanager to filter locations by drawing polygons on the map
- Foursquare API
  * To get information about a location -> website, address and phonenumbers
- Disqus API
  * To get a discussion modal on the site
- Giphy API webservice
  * To get awesome gifs in the infowindows
- Instant filtering of locs based on searchterm
- Responsive design

## Getting started
Getting a local devenvironment running on your machine

#### Instructions
1. Clone this repository and open the index.html file in your browser
2. If you experience issues/errors with this approach, you may serve the files from a (local) server.
3. You may also examine the running demo (see below)
4. In the cloned repo you can now edit the code using your favorite texteditor / devenv.
5. To fork and start developing further on this project you may change the API keys for foursquare (foursquareClientID, foursquareClientSecret), the google maps api key in the source url in index.html and the disqus (s.src) url in index.html

#### Known issues
- Disqus may not work locally due to the disqus api expecting the requests to come from the "peakbreaker.com" domain
- Due to this, the disqus scripts may throw wierd errors.  You can comment out the disqus api script in the index.html to see if disqus is the cause of the issue

#### Demo
 See a running demo of this app on my website:
 http://pages.peakbreaker.com/ScriptyJav

## LICENSE
The MIT License (MIT)

Copyright (c) 2017 Anders Hurum

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
