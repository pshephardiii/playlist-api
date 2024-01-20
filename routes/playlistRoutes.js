const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlistController')
const userController = require('../controllers/userController')


router.get('/', userController.auth, playlistController.indexPlaylists)
router.get('/:id', userController.auth, playlistController.showPlaylist)
router.post('/', userController.auth, playlistController.createPlaylist)
// router.post('/:id/songs/:songId', userController.auth, addSongToPlaylist)
router.put('/:id', userController.auth, playlistController.updatePlaylist)
router.delete('/:id', userController.auth, playlistController.deletePlaylist)

module.exports = router