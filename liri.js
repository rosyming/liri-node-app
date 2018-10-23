// Requiring the dotenv for the spotify keys
(function main() {
    require('dotenv').config();
    console.log('SPOTIFY_ID: ' + process.env.SPOTIFY_ID);
    console.log('SPOTIFY_SECRET: ' + process.env.SPOTIFY_SECRET);
}());

// Requirng to let us access all key.js exports
var keys = require('./keys.js');
console.log('-----------');
console.log('keys: ' + keys.spotify.id);

// Takeing two arguments.
// The first will be the action (i.e., 'concert-this', 'spotify-this-song', etc.)
// The second will be the input for the action (i.e., 'song name', 'artist/band name', etc. )
var nodeArgs = process.argv;
var action = nodeArgs[2];
var value = nodeArgs[3];

// Creating switch-case to direct which function will run.
switch (action) {
    case 'concert-this':
        concertSearch();
        break;

    case 'spotify-this-song':
        spotifySearch();
        break;

    case 'movie-this':
        movieSearch();
        break;

    case 'do-what-it-says':
        doThis();
        break;
}

// Concert Search Function
function concertSearch() {
    var request = require('request');

    request('https://rest.bandsintown.com/artists/' + value + '/events?app_id=codingbootcamp', function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log('Upcoming concerts for ' + value + ':')
            console.log('The movie\'s rating is: ' + JSON.parse(body).name);
        }
    });
};

// Spotify Search Function
function spotifySearch() {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({
        type: 'track',
        query: value,
        limit: 10
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log('My spotify song:' + JSON.stringify(data));
    });
};

// OMDB Search Function
function movieSearch() {
    var request = require('request');
    var movieName = '';

    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + '+' + nodeArgs[i];
        } else {
            movieName += nodeArgs[i];
        };
    };

    var queryUrl = 'http://www.omdbapi.com/?t=' + value + '&y=&plot=short&apikey=trilogy';
    var queryUrl2 = 'http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy';

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

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
            console.log('-------------');
        };

        if (value === '')
            return request(queryUrl2, function (error, response, body) {
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
                console.log('-------------');
                console.log('If you haven\'t watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>');
                console.log('It\'s on Netflix!');
                console.log('-------------');
            };
        });
    });
};