const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlistController')
const userController = require('../controllers/userController')

router.get('/', userController.auth, playlistController.indexPlaylists)
router.get('/:userId', userController.auth, playlistController.indexOwnedPlaylists)
router.get('/shared/:userId', userController.auth, playlistController.indexSharedPlaylists)
router.post('/', userController.auth, playlistController.createPlaylist)
router.post('/:playlistId/add', userController.auth, playlistController.addSong)
router.post('/:playlistId/remove', userController.auth, playlistController.removeSong)
router.post('/:searchedPlaylistId/clone/:userId', userController.auth, playlistController.clonePlaylist)
router.post('/:userId/:foundPlaylistId/comment', userController.auth, playlistController.leaveComment)
router.post('/share/:playlistId', userController.auth, playlistController.sharePlaylist)
router.put('/:playlistId', userController.auth, playlistController.updatePlaylist)
router.delete('/:userId/:playlistId', userController.auth, playlistController.deletePlaylist)
router.get('/:userId/:searchedPlaylistId', userController.auth, playlistController.showPlaylist)

module.exports = router