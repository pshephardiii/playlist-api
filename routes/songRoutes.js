const express = require('express')
const router = express.Router()
const songController = require('../controllers/songController')

router.get('/', songController.indexAllSongs)
router.get('/title/:title', songController.indexSongsByTitle)
router.get('/artists/:artist', songController.indexSongsByArtist)
router.get('/albums/:album', songController.indexSongsByAlbumTitle)
router.get('/artists/:artist/albums/:album', songController.indexSongsByArtistAndAlbum)
router.get('/genre/:genre', songController.indexSongsByGenre)
router.get('/:id', songController.showSong)

module.exports = router