//T.A.R.I.A
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api") //music

var axios = require('axios'); //Retriever

var moment = require('moment');

var file = require('file-system');

var inquirer = require("inquirer");

var spotifyKey = new Spotify(keys.spotify);

//all the functions
var band = function(artist) {
  if (artist.trim() === "") {
    console.log("Taria says: No artist selected")
    reRun()
  }else {
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
        reRun()
    })}
}

var music = function(song) {
  if (song.trim() === "") {
    console.log('Taria says: Default song: The "Sign"')
    song = "The Sign"
  }
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
  reRun()
})
.catch(function(err) {
  console.log(err)
})
}

var movie = function(movieName) {
  if (movieName.trim() === "") {
    console.log('Taria says: No movie selected')
    reRun()
  } else {
  //builds the url
  var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=ded7cf4";
  //searches for the movie
  axios.get(movieUrl).then(
      function(response) { //Need some way to loop through all these variables to catch any undefined values.
var info = response.data
var title = info.Title
var year = info.Year
var country = info.Country
var lang = info.Language
var cast = info.Actors
var rating1 = info.Ratings[0]
var rating2 = info.Ratings[1]
var plot = info.Plot
      console.log("Taria says: " + title);
      console.log("----Info----")
      console.log("Was released in: " + year);
      console.log("Produced by: " + country)
      console.log("Languages avialable: " + lang)
      console.log("Cast: " + cast)
      console.log("----Ratings----")
      console.log(rating1.Source + " rating: " + rating1.Value)
      console.log(rating2.Source + " rating: " + rating2.Value)
      console.log("----Plot----")
      console.log(plot)
      reRun()
  })}}

  var switchItems = function(choices, input) {
    //switch case
      switch (choices.task) {
          case "band": {
    
        var artist = input.input
    
        band(artist)
    
        break;
        }
    
          case "music": {
    
        var song = input.input
    
        music(song)
          
        break;
        }
    
          case "movie": { // Movie search
        //takes the input and joins all instances in the array with a hyphen
        var movieName = input.input
    
        movie(movieName)
       
        break;
        }
    
        case "do": {
          file.readFile('./random.txt', 'utf8', function(err, data){
            if (err){ 
              return console.log(err);
            }
            var dataArr = data.split(',');
    
            var doInstructions = dataArr[1]
            switch (dataArr[0]) {
              case "band": {
        
            var artist = doInstructions
        
            band(artist)
        
            break;
            }
        
              case "music": {
        
            var song = doInstructions
        
            music(song)
              
            break;
            }
        
              case "movie": { // Movie search
            //takes the input and joins all instances in the array with a hyphen
            var movieName = doInstructions
        
            movie(movieName)
           
            break;
            }}
          });
          break;
        }
    
        case "exit": {
          console.log("Taria says: Goodbye")
          break;
        }
    
          default: { // If none of the available calls are selected
        console.log("Taria says: I'm sorry, I didn't catch that.")
        break;
        }
      }
    //end switch case
          }

//end all the functions
var reRun = function() {
    inquirer.prompt([
      {
        type: "list",
        name: "task",
        message: "What would you like to search for?",
        choices: ["band", "music", "movie", "do", "exit"]
      }])
      .then(function(choices){
        if ((choices.task !== "do") && (choices.task !== "exit")) {
        inquirer.prompt([
      {
        type: "input",
        name: "input",
        message: "Search:"
      }
    ]).then(function(input){
  switchItems(choices, input)
    })
  } else {
    switchItems(choices)
  }
  })
}
reRun()
