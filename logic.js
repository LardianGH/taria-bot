//T.A.R.I.A
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api") //music

var axios = require('axios'); //Retriever

var moment = require('moment');

var file = require('file-system');

var inquirer = require("inquirer");

var fs = require("fs");

var spotifyKey = new Spotify(keys.spotify);

var log

var querDiv = "\n~~~Query~~~\n"

var resDiv = "~~~Response~~~\n"

var timeStamp = (+ new Date())

 //Start new
 fs.appendFile("log.txt", "(((Start new session)))---" + timeStamp, function(err) {
  if (err) throw err;
});
//end Start new

//all the functions
var logger = function(log) {
   //logging
     fs.appendFile("log.txt", resDiv + log, function(err) {
       if (err) throw err;
     });
     //end logging
}

var band = function(artist) {
  var concerts = []
  var concert
  if (artist.trim() === "") {
    log = "Taria says: No artist selected"
    console.log(log)
        logger(log)
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
        concert = `(${venue}) - ${location} on ${date}`
        concerts.push(concert)
        }
        log = concerts.join("\n")
      }
        else{log = "Taria says: There are no upcoming tours by this artist"}
        console.log(log)
        logger(log)
        reRun()
    })}
    
}

var music = function(song) {
  if (song.trim() === "") {
    console.log('Taria says: Default song: The "Sign"')
    song = "Ace of Base The Sign"
  }
spotifyKey.search({ type: 'track', query: song, limit: 1 })

.then(function(response) {
  var songData = (response.tracks.items[0])
  var band = (songData.artists[0].name) //Band name
  var link = (songData.external_urls.spotify) //Link to song
  var songName = (songData.name) //Song name
  var albumName = (songData.album.name) //album name
log = (`${songName}, released by: ${band}
Part of the ${albumName} album
link: ${link}`)
  console.log("Taria says: " + log)
  logger(log)
  reRun()
})
.catch(function(err) {
  console.log(err)
})
}

var movie = function(movieName) {
  if (movieName.trim() === "") {
    log = 'Taria says: No movie selected'
    console.log(log)
    logger(log)
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
log = `Taria says: ${title}
----Info----
Was released in: ${year}
Produced by: ${country}
Languages avialable: ${lang}
Cast: ${cast}
----Ratings----
${rating1.Source} rating: ${rating1.Value}
${rating2.Source} rating: ${rating2.Value}
----Plot----
${plot}`
console.log(log)
logger(log)
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
  //logging
  var showData = (`Task: ${choices.task}
`)
  
  fs.appendFile("log.txt", querDiv + showData, function(err) {
    if (err) throw err;
  });
  //end logging
  })
}
reRun()
