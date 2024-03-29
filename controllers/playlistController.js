const Playlist = require('../models/playlist')
const Song = require('../models/song')
const User = require('../models/user')
const Comment = require('../models/comment')

exports.indexPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ public: true })
    res.status(200).json(playlists)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.indexOwnedPlaylists = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.userId })
    const playlists = await Playlist.find({ user: user })
    res.status(200).json(playlists)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.indexSharedPlaylists = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id })
    const playlists = await Playlist.find({ sharedWith: [user._id] })
    res.status(200).json(playlists)
  } catch(error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createPlaylist = async (req, res) => {
  try {
    req.body.user = req.user._id
    const foundUser = await User.findOne({ _id: req.user._id })
    if (!foundUser) throw new Error(`Could not locate user ${req.user._id}`)
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
    if (!foundPlaylist) throw new Error(`Could not locate playlist ${req.params.playlistId}`)
    const foundSong = await Song.findOne({ _id: req.body.songId })
    if (!foundSong) throw new Error (`Could not locate song ${req.body.songId}`)
    foundPlaylist.songs.push(foundSong._id)
    foundSong.playlists.push(foundPlaylist._id)
    await foundPlaylist.save()
    await foundSong.save()
    res.status(200).json({
      message: `Successfully added song ${req.body.songId} to playlist ${req.params.playlistId}`,
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
    if (!foundPlaylist) throw new Error(`Could not locate playlist ${req.params.playlistId}`)
    const foundSong = await Song.findOne({ _id: req.body.songId })
    if (!foundSong) throw new Error(`Could not locate song ${req.body.songId}`)
    const songIndex = foundPlaylist.songs.indexOf(foundSong._id)
    if (!(foundPlaylist.songs.includes(foundSong._id))) throw new Error(`Playlist ${foundPlaylist._id} does not include song ${foundSong._id}`)
    const playlistIndex = foundSong.playlists.indexOf(foundPlaylist._id)
    foundPlaylist.songs.splice(songIndex, 1)
    foundSong.playlists.splice(playlistIndex, 1)
    await foundPlaylist.save()
    await foundSong.save()
    res.status(200).json({
      message: `Successfully removed song ${req.body.songId} from playlist ${req.params.playlistId}`,
      playlist: foundPlaylist,
      song: foundSong
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.clonePlaylist = async (req, res) => {
  try {
    const existingPlaylist = await Playlist.findOne({ _id: req.params.foundPlaylistId })
    if (!existingPlaylist) throw new Error(`Could not locate playlist ${req.params.foundPlaylistId}`)
    const cloningUser = await User.findOne({ _id: req.params.userId })
    if (!cloningUser) throw new Error(`Could not locate user ${req.params.userId}`)
    if (existingPlaylist.public === false) {
      if (`${existingPlaylist.user}` !== `${cloningUser._id}`) {
        throw new Error(`playlist ${req.params.foundPlaylistId} is set to private`)
      }
    }
    existingPlaylist.cloned.push(cloningUser._id)
    const existingPlaylistSongs = existingPlaylist.songs.slice()
    const clonePlaylist = new Playlist({ title: `${existingPlaylist.title}_copy`, user: cloningUser._id, songs: existingPlaylistSongs })
    cloningUser.playlists.push(clonePlaylist._id)
    await existingPlaylist.save()
    await cloningUser.save()
    await clonePlaylist.save()
    res.status(200).json({
      message: `Successfully cloned playlist ${existingPlaylist._id} to user ${cloningUser._id} playlists array`,
      existingPlaylist: existingPlaylist,
      cloningUser: cloningUser,
      clonePlaylist: clonePlaylist
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.leaveComment = async (req, res) => {
  try {
    const commentingUser = await User.findOne({ _id: req.params.userId })
    if (!commentingUser) throw new Error(`Could not locate user ${req.params.userId}`)
    const foundPlaylist = await Playlist.findOne({ _id: req.params.foundPlaylistId })
    if (!commentingUser) throw new Error(`Could not locate playlist ${req.params.foundPlaylistId}`)
    if (foundPlaylist.public === false) {
      if (`${foundPlaylist.user}` !== `${commentingUser._id}`) {
        throw new Error('playlist is set to private')
      }
    }
    const newComment = new Comment({ content: req.body.content, user: commentingUser._id, playlist: foundPlaylist._id })
    foundPlaylist.comments.push(newComment._id)
    newComment.playlist = foundPlaylist._id
    commentingUser.comments.push(newComment._id)
    await newComment.save()
    await foundPlaylist.save()
    await commentingUser.save()
    res.status(200).json({
      comment: newComment,
      playlist: foundPlaylist,
      commenter: commentingUser
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.sharePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.playlistId })
    if (!playlist) throw new Error(`Could not locate playlist ${req.params.playlistId}`)
    const user = await User.findOne({ _id: req.body.userId })
    if (!user) throw new Error(`Could not locate user ${req.body.userId}`)
    playlist.sharedWith.push(user._id)
    user.playlists.push(playlist._id)
    await playlist.save()
    await user.save()
    res.status(200).json({ playlist, user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.likePlaylist = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
    if(!user) throw new Error(`Could not locate user ${req.params.userId}`)
    const playlist = await Playlist.findOne({ _id: req.params.foundPlaylistId })
    if(!playlist) throw new Error(`Could not locate playlist ${req.params.foundPlaylistId}`)
    if (playlist.public === false) {
      if (`${playlist.user}` !== `${user._id}`) {
        throw new Error('playlist is set to private')
      }
    }
    if (user.likedPlaylists.includes(playlist._id)) {
      const playlistIndex = user.likedPlaylists.indexOf(playlist._id)
      user.likedPlaylists.splice(playlistIndex, 1)
      playlist.likes = playlist.likes - 1
    } else {
    user.likedPlaylists.push(playlist._id)
    playlist.likes = playlist.likes + 1
    }
    await user.save()
    await playlist.save()
    res.status(200).json({
      userLikedPlaylists: user.likedPlaylists, 
      playlistLikes: playlist.likes 
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate({ _id: req.params.playlistId }, req.body, { new: true })
    if (!playlist) throw new Error(`Could not locate playlist ${req.params.playlistId}`)
    res.status(200).json(playlist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deletePlaylist = async (req, res) => {
  try {
    const owner = await User.findOne({ _id: req.params.userId })
    if (!owner) throw new Error(`Could not locate user ${req.params.userId}`)
    const playlistIndex = owner.playlists.indexOf(req.params.playlistId)
    owner.playlists.splice(playlistIndex, 1)
    await owner.save()
    await Playlist.findOneAndDelete({ _id: req.params.playlistId })
    res.status(200).json({ message: `Playlist ${req.params.playlistId} deleted`, updatedPlaylistsArr: owner.playlists })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.showPlaylist = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
    if (!user) throw new Error(`Could not locate user ${req.params.userId}`)
    const playlist = await Playlist.findOne({ _id: req.params.foundPlaylistId })
    if (!playlist) throw new Error(`Could not locate playlist ${req.params.foundPlaylistId}`)
    if (playlist.public === false) {
      if (`${playlist.user}` !== `${user._id}`){
        throw new Error('playlist is set to private')
      }
    }
    res.status(200).json(playlist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
