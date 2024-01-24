const express = require('express')
const router = express.Router()
const songController = require('../controllers/songController')


// I'll need to figure out how to index songs based on artist and album
// I'll need to figure out how to add and delete songs from playlists

router.get('/', songController.indexAllSongs)
router.get('/title/:title', songController.indexSongsByTitle)
router.get('/artists/:artist', songController.indexSongsByArtist)
router.get('/albums/:album', songController.indexSongsByAlbumTitle)
router.get('/artists/:artist/albums/:album', songController.indexSongsByArtistAndAlbum)
router.get('/genre/:genre', songController.indexSongsByGenre)
router.get('/:id', songController.showSong)

module.exports = router