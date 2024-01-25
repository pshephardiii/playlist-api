const mongoose = require('mongoose')
const User = require('./user')

const playlistSchema = new mongoose.Schema ({
  title: { type: String, required: true },
  public: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist