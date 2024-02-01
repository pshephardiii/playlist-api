const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema ({
  title: { type: String, required: true },
  public: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  cloned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: { type: Number, default: 0 }
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist