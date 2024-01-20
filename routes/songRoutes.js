const express = require('express')
const router = express.Router()
const songController = require('../controllers/songController')


// I'll need to figure out how to index songs based on artist and album
// I'll need to figure out how to add and delete songs from playlists

router.get('/', songController.indexAllSongs)
router.get('/:artist', songController.indexSongsByArtist)
router.get('/:album', songController.indexByAlbumTitle)
router.get('/:artist/:album', songController.indexSongsByArtistAndAlbum)
router.get('/:genre', songController.indexSongsByGenre)
router.get('/:title', songController.indexSongsByTitle)
router.get('/:id', songController.showSong)

module.exports = router