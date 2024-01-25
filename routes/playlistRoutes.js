const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlistController')
const userController = require('../controllers/userController')


router.get('/', userController.auth, playlistController.indexPlaylists)
router.post('/', userController.auth, playlistController.createPlaylist)
router.post('/:playlistId/songs/:songId', userController.auth, playlistController.addSong)
router.post('/:playlistId/remove/songs/:songId', userController.auth, playlistController.removeSong)
router.put('/:id', userController.auth, playlistController.updatePlaylist)
router.delete('/:id', userController.auth, playlistController.deletePlaylist)
router.get('/:id', userController.auth, playlistController.showPlaylist)

module.exports = router