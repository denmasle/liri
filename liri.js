require("dotenv").config();

var keys = require("./keys");
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");

var command = process.argv[2];

//command options
if (command === "spotify-this-song") {
    spotifyInfo();
} 
else if (command === "movie-this") {
    omdbInfo();
} 
else if (command === "do-what-it-says") {
    doWhat();
} 
else {
    console.log("Wrong command! Enter one of these commands: spotify-this-song, movie-this, do-what-it-says");
}

//spotify function for songs
function spotifyInfo() {

    var spotify = new Spotify(keys.spotify);
    var arg = process.argv;
    var song = "";

    for (i = 3; i < arg.length; i++) {
        if (i > 3 && i < arg.length) {
            song = song + " " + arg[i];
        }
        else {
            song = arg[i];
        }
    };

    if (arg.length < 4) {
        song = "The Sign Ace of Base";
        process.argv[3] = song;
    }

    spotify.search({
        type: "track",
        query: song,
        limit: 1
    }, function (error, data) {
        if (error) {
            console.log("Something went wrong: " + error);
            return error;
        }
        console.log(`
        \n*********************************************************************************************************************
        \nArtist: ${data.tracks.items[0].album.artists[0].name}
        \nSong: ${data.tracks.items[0].name}
        \nPreview: ${data.tracks.items[0].external_urls.spotify}
        \nAlbum: ${data.tracks.items[0].album.name}
        \n*********************************************************************************************************************
        `)
        fs.appendFileSync("log.txt", (`
        \n*********************************************************************************************************************
        \nArtist: ${data.tracks.items[0].album.artists[0].name}
        \nSong: ${data.tracks.items[0].name}
        \nPreview: ${data.tracks.items[0].external_urls.spotify}
        \nAlbum: ${data.tracks.items[0].album.name}
        \n*********************************************************************************************************************
        `),
        function (error) {
            if (error) {
                console.log(error);
            };
        });
    });
};

//movie function for omdb
function omdbInfo() {

    var arg = process.argv;
    var movie = "";

    for (i = 3; i < arg.length; i++) {
        if (i > 3 && i < arg.length) {
            movie = movie + "+" + arg[i];
        }
        else {
            movie = arg[i];
        }
    };

    //if no movie specified run default
    if (movie === "") {
        movie = "Mr. Nobody";
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    //omdb request for movie
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(`
            \n*********************************************************************************************************************
            \nTitle: ${JSON.parse(body).Title}
            \nYear: ${JSON.parse(body).Year}
            \nIMDB: ${JSON.parse(body).imdbRating}
            \nRotten Tomatoes: ${JSON.parse(body).Ratings[1].Value}
            \nCountry: ${JSON.parse(body).Country}
            \nLanguage: ${JSON.parse(body).Language}
            \nPlot: ${JSON.parse(body).Plot}
            \nActors: ${JSON.parse(body).Actors}
            \n*********************************************************************************************************************
            `)
            fs.appendFileSync("log.txt", (`
            \n*********************************************************************************************************************
            \nTitle: ${JSON.parse(body).Title}
            \nYear: ${JSON.parse(body).Year}
            \nIMDB: ${JSON.parse(body).imdbRating}
            \nRotten Tomatoes: ${JSON.parse(body).Ratings[1].Value}
            \nCountry: ${JSON.parse(body).Country}
            \nLanguage: ${JSON.parse(body).Language}
            \nPlot: ${JSON.parse(body).Plot}
            \nActors: ${JSON.parse(body).Actors}
            \n*********************************************************************************************************************
            `),
            function (error) {
                if (error) {
                    console.log(error);
                };
            });
        } 
        else {
            console.log("Error!");
        }
    });
};

//do-what-it-says random function
function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var data = data.split(",");

        if (data[0] === "spotify-this-song") {
            process.argv[3] = data[1];
            spotifyInfo();
        }
    })
};