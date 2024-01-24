const Playlist = require('../models/playlist')
const User = require('../models/user')


exports.indexPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({})
    res.status(200).json(playlists)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.showPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id })
    res.status(200).json(playlist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// think about how to add playlist to user playlists array

exports.createPlaylist = async (req, res) => {
  try {
    req.body.user = req.user._id
    const foundUser = await User.findOne({ _id: req.user._id })
    const playlist = await Playlist.create(req.body)
    foundUser.playlists.push(playlist._id)
    await foundUser.save()
    res.status(200).json({ playlist, foundUser })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.status(200).json(playlist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.findOneAndDelete({ _id: req.params.id })
    res.status(200).json({ message: `Playlist ${req.params.id} deleted` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}