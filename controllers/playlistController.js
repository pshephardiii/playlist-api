const Playlist = require('../models/playlist')
const Song = require('../models/song')
const User = require('../models/user')

exports.indexPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({})
    res.status(200).json(playlists)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

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

exports.addSong = async (req, res) => {
  try {
    const foundPlaylist = await Playlist.findOne({ _id: req.params.playlistId })
    const foundSong = await Song.findOne({ _id: req.params. songId })
    foundPlaylist.songs.push(foundSong._id)
    foundSong.playlists.push(foundPlaylist._id)
    await foundPlaylist.save()
    await foundSong.save()
    res.status(200).json({
        message: `Successfully added song ${req.params.songId} to playlist ${req.params.playlistId}`,
        playlist: foundPlaylist,
        song: foundSong
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.removeSong = async (req, res) => {
  try {
    const foundPlaylist = await Playlist.findOne({ _id: req.params.playlistId })
    const foundSong = await Song.findOne({ _id: req.params. songId })
    const songIndex = foundPlaylist.songs.indexOf(foundSong._id)
    const playlistIndex = foundSong.playlists.indexOf(foundPlaylist._id)
    foundPlaylist.songs.splice(songIndex, 1)
    foundSong.playlists.splice(playlistIndex, 1)
    await foundPlaylist.save()
    await foundSong.save()
    res.status(200).json({
        message: `Successfully removed song ${req.params.songId} from playlist ${req.params.playlistId}`,
        playlist: foundPlaylist,
        song: foundSong
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.clonePlaylist = async (req, res) => {
    try {
      const playlist1 = await Playlist.findOne({ _id: req.params.playlistId })
      const user1 = await User.findOne({ _id: req.params.userId })
      playlist1.cloned.push(user1._id)
      const playlist1Songs = playlist1.songs.slice()
      const playlist2 = new Playlist({ title: `${playlist1.title}_copy`, user: user1._id, songs: playlist1Songs })
      user1.playlists.push(playlist2._id)
      await playlist1.save()
      await user1.save()
      await playlist2.save()
      res.status(200).json({
        message: `Successfully cloned playlist ${playlist1._id} to user ${user1._id} playlists array`,
        playlist1: playlist1,
        user: user1,
        playlist2: playlist2
      })
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

exports.showPlaylist = async (req, res) => {
    try {
      const playlist = await Playlist.findOne({ _id: req.params.id })
      res.status(200).json(playlist)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }