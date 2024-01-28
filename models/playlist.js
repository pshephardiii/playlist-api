const mongoose = require('mongoose')


const playlistSchema = new mongoose.Schema ({
  title: { type: String, required: true },
  public: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  cloned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: Number
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist