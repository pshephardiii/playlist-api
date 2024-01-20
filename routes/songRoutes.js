const express = require('express')
const router = express.Router()
const songController = require('../controllers/songController')

router.get('/:id', songController.showSong)
// I'll need to figure out how to index songs based on artist and album
// I'll need to figure out how to add and delete songs from playlists
// do I need these below??
router.post('/', songController.createSong)
router.put('/:id', songController.updateSong)
router.delete('/:id', songController.deleteSong)

module.exports = router