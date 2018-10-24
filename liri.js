// Requiring the dotenv for the spotify keys
(function main() {
    require('dotenv').config();
}());

// Requirng to let us access all key.js exports
var keys = require('./keys.js');

// Takeing two arguments. The first will be the action (i.e., 'concert-this', 'spotify-this-song', etc.)
// The second will be the input for the action (i.e., 'song name', 'artist/band name', etc. )
var nodeArgs = process.argv;
var action = nodeArgs[2];
var value = nodeArgs.slice(3).join(' ');

// Creating switch-case to direct which function will run========================
function Switching(action, value) {
    switch (action) {
        case 'concert-this':
            concertSearch(value);
            break;

        case 'spotify-this-song':
            spotifySearch(value);
            break;

        case 'movie-this':
            movieSearch(value);
            break;

        case 'do-what-it-says':
            doThis();
            break;
    };
};

// Concert Search Function============================================
function concertSearch(value) {
    var request = require('request');
    var moment = require('moment');

    // If no band is provided, default band is Pentatonix
    if (!value) {
        value = 'Pentatonix';
    };

    // API HTTP Request
    var bandQueryUrl = 'https://rest.bandsintown.com/artists/' + value + '/events?app_id=codingbootcamp';
    
    request(bandQueryUrl, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            var bandQueryArr = [];
            bandQueryArr = JSON.parse(body);
            
            // Loop through request response for each venue and display info from response (e.g., Name of Venue, Venue location, Date of event)
            for (k = 0; k < 5; k++) {
                console.log('-------------');
                console.log('Upcoming concerts for ' + value + ':')
                console.log('Name of Venue: ' + bandQueryArr[k].venue.name);
                console.log('Venue Location: ' + bandQueryArr[k].venue.city + ', ' + bandQueryArr[k].venue.region + ', ' + bandQueryArr[k].venue.country);

                // Using Moment.js npm to display formatted date
                var randomDate = bandQueryArr[k].datetime;
                console.log('Date of Event: ' + 
                moment(randomDate).format('MM/DD/YYYY')             
                );
            };   
        };
    });
};

// Spotify Search Function============================================
function spotifySearch(value) {
    var Spotify = require('node-spotify-api');
    var returnLimit = 5
    
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    // If no song is provided, default song is "The Sign" by Ace of Base
    if (!value) {
        value = 'The Sign Ace of Base';
        returnLimit = 1;
    };

    spotify.search({
        type: 'track',
        query: value,
        limit: returnLimit,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };

        // Loop through request response for each song and display info from response (e.g., Artist name, Song name, Preview link, and Album)
        for (j = 0; j < data.tracks.items.length; j++) {
            var tracks = data.tracks
            console.log('-------------');
            console.log('Artist(s): ' + tracks.items[j].artists[0].name);
            console.log('Song Name: ' + tracks.items[j].name);
            console.log('Spotify Preview Link: ' + tracks.items[j].preview_url);
            console.log('Album: ' + tracks.items[j].album.name);
        };
    });
};

// OMDB Search Function===============================================
function movieSearch(value) {
    var request = require('request');

    // If no movie is provided, default movie is "Mr. Nobody"
    if (!value) {
        value = 'Mr. Nobody';
        console.log('-------------');
        console.log('If you haven\'t watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>');
        console.log('It\'s on Netflix!');
    };
     
    // API HTTP Request
    var movieQueryUrl = 'http://www.omdbapi.com/?t=' + value + '&y=&plot=short&apikey=trilogy';

    request(movieQueryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover Title, Year, imdbRating, Rotton Tomatoes Rating, Country, Language, Plot, and Actors
            console.log('-------------');
            console.log('Movie Title: ' + JSON.parse(body).Title);
            console.log('Release Year: ' + JSON.parse(body).Year);
            console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
            console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
            console.log('Country Produced: ' + JSON.parse(body).Country);
            console.log('Language: ' + JSON.parse(body).Language);
            console.log('Plot: ' + JSON.parse(body).Plot);
            console.log('Actors: ' + JSON.parse(body).Actors);
        };
    });
};

// OMDB Search Function===============================================
function doThis (value) {
    var fs = require("fs");

    // Reading the random.txt file
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }

        data = data.split(',');
        action = data[0];
        value = data[1].replace(/['"]+/g, '')  
        
        Switching(action, value);
    });
};

// Starting Switch Function
Switching(action, value);





