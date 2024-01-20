const Song = require('../models/song')

exports.showSong = async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id })
    res.json(song)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// when it comes to creating songs, how to make it so users can't do it??
// Do I need a create song thing or just relation to playlists?

exports.createSong = async (req, res) => {
  try {
    const song = new Song(req.body)
    await song.save()
    res.json(song)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json(song)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findOneAndDelete({ _id: req.params.id })
    res.status(204).json({ message: 'Song deleted '})
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}