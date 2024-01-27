const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlistController')
const userController = require('../controllers/userController')

router.get('/', userController.auth, playlistController.indexPlaylists)
router.post('/', userController.auth, playlistController.createPlaylist)
router.post('/:id/add/songs/:songId', userController.auth, playlistController.addSong)
router.post('/:id/remove/songs/:songId', userController.auth, playlistController.removeSong)
router.post('/:id/clone/:userId', userController.auth, playlistController.clonePlaylist)
router.post('/:id/comment/', userController.auth, playlistController.leaveComment)
router.put('/:id', userController.auth, playlistController.updatePlaylist)
router.delete('/:userId/:playlistId', userController.auth, playlistController.deletePlaylist)
router.get('/:id', userController.auth, playlistController.showPlaylist)

module.exports = router