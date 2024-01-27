const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlistController')
const userController = require('../controllers/userController')

router.get('/', userController.auth, playlistController.indexPlaylists)
router.get('/:userId', userController.auth, playlistController.indexOwnedPlaylists)
router.post('/', userController.auth, playlistController.createPlaylist)
router.post('/:playlistId/add/songs/:songId', userController.auth, playlistController.addSong)
router.post('/:playlistId/remove/songs/:songId', userController.auth, playlistController.removeSong)
router.post('/:id/clone/:userId', userController.auth, playlistController.clonePlaylist)
router.post('/:userId/:id/comment/', userController.auth, playlistController.leaveComment)
router.put('/:playlistId', userController.auth, playlistController.updatePlaylist)
router.delete('/:userId/:playlistId', userController.auth, playlistController.deletePlaylist)
router.get('/search/:ownerId/:searchedPlaylistId', userController.auth, playlistController.showPlaylist)

module.exports = router