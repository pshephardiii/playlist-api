const Song = require('../models/song')

exports.indexAllSongs = async (req, res) => {
  try {
    const songs = await Song.find({})
    res.status(200).json(songs) 
  } catch (error) {
    res.status(400).json({ message: error.message })    
  }
}

exports.indexSongsByTitle = async (req, res) => {
  try {
    const songs = await Song.find({ title: req.params.title })
    res.status(200).json(songs) 
  } catch (error) {
    res.status(400).json({ message: error.message })    
  }
}

exports.indexSongsByArtist = async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.params.artist })
    res.status(200).json(songs) 
  } catch (error) {
    res.status(400).json({ message: error.message })    
  }
}

exports.indexSongsByAlbumTitle = async (req, res) => {
  try {
    const songs = await Song.find({ album: req.params.album })
    res.status(200).json(songs) 
  } catch (error) {
    res.status(400).json({ message: error.message })    
  }
}

exports.indexSongsByArtistAndAlbum = async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.params.artist, album: req.params.album })
    res.status(200).json(songs) 
  } catch (error) {
    res.status(400).json({ message: error.message })    
  }
}

exports.indexSongsByGenre = async (req, res) => {
  try {
    const songs = await Song.find({ genre: req.params.genre })
    res.status(200).json(songs) 
  } catch (error) {
    res.status(400).json({ message: error.message })    
  }
}

exports.showSong = async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id })
    res.status(200).json(song)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

