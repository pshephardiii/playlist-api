const Playlist = require('../models/playlist')

exports.indexPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({})
    res.json(playlists)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.showPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createPlaylist = async (req, res) => {
  try {
    const playlist = new Playlist(req.body)
    await playlist.save()
    res.json(playlist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json(playlist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.findOneAndDelete({ _id: req.params.id })
    res.status(204).json({ message: 'Playlist deleted' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}