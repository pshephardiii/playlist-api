const Song = require('../models/song')

exports.showSong = async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id })
    res.status(200).json(song)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// use find({ condition }) to index songs based on artist, album, title, genre, etc.
// need to be able to add to playlist and take off playlist... wait until Tuesday lesson for this
// idea: maybe sort based on popularity? Like number of listens... figure this out if time

