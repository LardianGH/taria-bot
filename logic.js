//T.A.R.I.A
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api") //music

var axios = require('axios'); //Retriever

var moment = require('moment');

var file = require('file-system');

var spotifyKey = new Spotify(keys.spotify);

var task = process.argv[2]

var input = []

input.push(process.argv[3])

for (i=4; i< (process.argv.length); i++) {
    input.push(process.argv[i])
    }

// if (task === "do"){
//     file.readFile('./random.txt', 'utf8', function(err, data){
//       if (err){ 
//         return console.log(err);
//       }
//       console.log(data)
//       var dataArr = data.split(',');
//       console.log(dataArr[0], dataArr[1]);
//       input = data
//     });
// }

    switch (task) {
  case "band": {

var artist = input.join(" ")

axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
  function(response) {
          if ((response.data != "\n{warn=Not found}\n") && (response.data.length > 0)) {
          console.log("Taria says: " + artist + " is playing at:")
      for (i=0; i<response.data.length; i++){
      var venue = response.data[i].venue.name
      var location = response.data[i].venue.city + ", " + response.data[i].venue.region
      var date = moment(response.data[i].datetime).format("MM/DD/YYYY")
      console.log("(" + venue + ") - " + location + " on " + date)
      }}
      else{console.log("Taria says: There are no upcoming tours by this artist")}
  })
  break;
}

  case "music": {
  var song = '"' + input.join(" ") + '"'
spotifyKey.search({ type: 'track', query: song, limit: 1 })
.then(function(response) {
  var songData = (response.tracks.items[0])
  var band = (songData.artists[0].name) //Band name
  var link = (songData.external_urls.spotify) //Link to song
  var songName = (songData.name) //Song name
  var albumName = (songData.album.name) //album name
  console.log("Taria says: " + songName + ", released by: " + band)
  console.log("Part of the " + albumName + " album")
  console.log("link:", link)
})
.catch(function(err) {
  console.log(err)
})
break;
}

  case "movie": { // Movie search
//takes the input and joins all instances in the array with a hyphen
var movieName = input.join("-")
//builds the url
var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=ded7cf4";
//searches for the movie
axios.get(movieUrl).then(
    function(response) {
//console.log(response)
    console.log("Taria says: " + response.data.Title);
    console.log("----Info----")
    console.log("Was released in: " + response.data.Year);
    console.log("Produced by: " + response.data.Country)
    console.log("Languages avialable: " + response.data.Language)
    console.log("Cast: " + response.data.Actors)
    console.log("----Ratings----")
    console.log(response.data.Ratings[0].Source + " rating: " + response.data.Ratings[0].Value)
    console.log(response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value)
    console.log("----Plot----")
    console.log(response.data.Plot)

    // * Plot of the movie.
    // * Actors in the movie.

})
break;
}

  case undefined: { // If none of the available calls are selected
console.log("Taria says: I'm sorry, I didn't catch that.")
break;
}
    }
