const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlistController')
const userController = require('../controllers/userController')

router.get('/', userController.auth, playlistController.indexPlaylists)
router.get('/:userId', userController.auth, playlistController.indexOwnedPlaylists)
router.get('/:userId/shared', userController.auth, playlistController.indexSharedPlaylists)
router.post('/', userController.auth, playlistController.createPlaylist)
router.post('/:playlistId/songs/add', userController.auth, playlistController.addSong)
router.post('/:playlistId/songs/remove', userController.auth, playlistController.removeSong)
router.post('/:userId/:foundPlaylistId/clone', userController.auth, playlistController.clonePlaylist)
router.post('/:userId/:foundPlaylistId/comment', userController.auth, playlistController.leaveComment)
router.post('/:playlistId/share', userController.auth, playlistController.sharePlaylist)
router.put('/:playlistId', userController.auth, playlistController.updatePlaylist)
router.delete('/:userId/:playlistId', userController.auth, playlistController.deletePlaylist)
router.get('/:userId/:foundPlaylistId', userController.auth, playlistController.showPlaylist)

module.exports = router