require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('home.hbs')
})

app.get('/artist-search', (req, res) => {
    let artistName = req.query.artist
    spotifyApi
        .searchArtists(artistName)
            .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items);
            //data.body because body is what spotify has decided is going to hold all the info
            //in axios it's data, here it's body. such is life
            //always check in console log what the data structure looks like so you can see how to access data
            let artists = data.body.artists.items
                // artists.forEach((artists) => {
                //     console.log(artists.images)
                // })
                //^ this is to see what the array of images looks like in the console log
                //so we have a better idea of how to access it
            res.render('artist-search-results.hbs', {artists})
            })
            .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    let artistId = req.params.artistId

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        //console.log('Artist albums', data.body);
        let albums = data.body.items
        res.render('albums.hbs', {albums})
    })
    .catch(err => {
        console.error(err);
    }
    );
});

app.get('/tracks/:albumId', (req, res, next) => {
    let albumId = req.params.albumId

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        //console.log('Album tracks', data.body);
        let tracks = data.body.items
        res.render('tracks.hbs', {tracks})
    })
    .catch(err => {
        console.error(err);
    }
    );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
