const request = require('supertest') 
const { MongoMemoryServer } = require('mongodb-memory-server') 
const app = require('../app') 
const User = require('../models/user') 
const Playlist = require('../models/playlist')
const mongoose = require('mongoose')
const Song = require('../models/song')
const server = app.listen(3001, () => console.log('Testing on Port 3001'))
let mongoServer 

beforeAll( async () => {
  mongoServer = await MongoMemoryServer.create()
  mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll( async () => {
  await mongoose.connection.close() 
  mongoServer.stop()
  server.close() 
})

describe('Test suite for the /playlists routes on our api', () => {



  // POSITIVE TEST CASES : INDEXING


  
  test('It should index all public playlists', async () => {

    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    await user.save()
    const token = await user.generateAuthToken()
    const playlist1 = new Playlist ({ title: 'title1', user: user._id, public: true })
    const playlist2 = new Playlist ({ title: 'title2', user: user._id, public: true })
    const playlist3 = new Playlist ({ title: 'title3', user: user._id, public: false })
    await playlist1.save()
    await playlist2.save()
    await playlist3.save()
    
    const response = await request(app)
      .get('/playlists')
      .set('Authorization', `Bearer ${token}`)
          
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    
    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i].user).toEqual(`${user._id}`)
      expect(response.body[i].public).toEqual(true)
     }
  })

  test('It should index only owned playlists', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const otherUser = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaulpaul2' })
    const token = await user.generateAuthToken()
    const playlist1 = new Playlist ({ title: 'title1', user: user._id, public: true })
    const playlist2 = new Playlist ({ title: 'title2', user: user._id, public: true })
    const playlist3 = new Playlist ({ title: 'title3', user: otherUser._id, public: true })
    user.playlists.push(playlist1, playlist2)
    await user.save()
    await otherUser.save()
    await playlist1.save()
    await playlist2.save()
    await playlist3.save()
    
    const response = await request(app)
      .get(`/playlists/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
          
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    
    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i].user).toEqual(`${user._id}`)
    }
  })



    // POSITIVE TEST CASES : PLAYLIST OWNERSHIP ACTIONS



  test('it should create a new playlist', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    await user.save()
    const token = await user.generateAuthToken()

    const response = await request(app)
      .post('/playlists').send({ title: 'Bangers Only', user: `${user._id}` })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.playlist.title).toEqual('Bangers Only')
    expect(response.body.playlist.user).toEqual(`${user._id}`)
    expect(response.body.foundUser.playlists).toContain(response.body.playlist._id)
  })

  test('it should add a song to the playlist and update both songs and playlists arrays', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const token = await user.generateAuthToken()
    const playlist1 = new Playlist({ title: 'PLAYLIST', user: user._id })
    const song1 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes' })
    user.playlists.push(playlist1._id)
    await user.save()
    await playlist1.save()
    await song1.save()

    const response = await request(app)
      .post(`/playlists/${playlist1._id}/songs/add`)
      .send({ songId: song1._id })
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.playlist.songs)).toBeTruthy()
    expect(Array.isArray(response.body.song.playlists)).toBeTruthy()
    expect(response.body.playlist.songs).toContain(`${song1._id}`)
    expect(response.body.song.playlists).toContain(`${playlist1._id}`)
  })

  test('it should remove a song from the playlist and update both songs and playlists arrays', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const token = await user.generateAuthToken()
    const playlist1 = new Playlist({ title: 'PLAYLIST', user: user._id, songs: [] })
    const song1 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    const song2 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    const song3 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    user.playlists.push(playlist1._id)
    await user.save()
    playlist1.songs.push(song1._id, song2._id, song3._id)
    await playlist1.save()
    await song1.save()
    await song2.save()
    await song3.save()

    const response = await request(app)
      .post(`/playlists/${playlist1._id}/songs/remove`)
      .send({ songId: song1._id })
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.playlist.songs)).toBeTruthy()
    expect(response.body.message).toEqual(`Successfully removed song ${song1._id} from playlist ${playlist1._id}`)
    expect(response.body.playlist.songs).toEqual([`${song2._id}`, `${song3._id}`])
  })

  test('It should allow a user to share a playlist with another user', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaulpaul2' })
    const playlist = new Playlist({ title: 'share me!', user: user1._id })
    user1.playlists.push(playlist)
    const token = await user1.generateAuthToken()
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .post(`/playlists/${playlist._id}/share`)
      .send({ userId: user2._id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.playlist.sharedWith).toContain(`${user2._id}`)
    expect(response.body.user.playlists).toContain(`${playlist._id}`)
  })

  test('it should update a playlist', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const token = await user.generateAuthToken()
    const playlist = new Playlist({ title: 'Bangers Only', user: user._id })
    user.playlists.push(playlist._id)
    await user.save()
    await playlist.save()

    const response = await request(app)
      .put(`/playlists/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Only Good Songs' })
      
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toEqual('Only Good Songs')
    expect(response.body.user).toEqual(`${user._id}`)
  })

  test('it should delete a playlist', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const token = await user.generateAuthToken()
    const playlist = new Playlist({ title: 'Bangers Only', user: user._id })
    user.playlists.push(playlist._id)
    await user.save()
    await playlist.save()

    const response = await request(app)
      .delete(`/playlists/${user._id}/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)

    let allPlaylists = await Playlist.find({})
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual(`Playlist ${playlist._id} deleted`)
    expect(allPlaylists).not.toContain(playlist)
    expect(response.body.updatedPlaylistsArr).not.toContain(playlist._id)
  })

  test('it should get an owned playlist by id', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const token = await user.generateAuthToken()
    const playlist = new Playlist({ title: 'Bangers Only', user: user._id })
    await user.save()
    await playlist.save()

    const response = await request(app)
      .get(`/playlists/${user._id}/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.title).toEqual('Bangers Only')
    expect(response.body.user).toEqual(`${user._id}`)
  })



  // POSITIVE TEST CASES : NON-OWNERSHIP ACTIONS



  test(`It should clone an existing playlist and add it to the user's playlists array without affecting original playlist`, async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Other guy', email: 'coolguy@coolguy.cool', password: "doyouthinkimcool" })
    const token = await user2.generateAuthToken()
    const playlist = new Playlist({ title: 'Best playlist', user: user1._id, public: true })
    const song = new Song({ title: 'cool song', artist: 'cool artist', album: 'so so album', genre: 'electro-pop-punk-reggae' })
    playlist.songs.push(song._id)
    user1.playlists.push(playlist._id)
    await user1.save()
    await user2.save()
    await playlist.save()
    await song.save()

    const response = await request(app)
      .post(`/playlists/${user2._id}/${playlist._id}/clone`)
      .set('Authorization', `Bearer ${token}`)

    let newPlaylist = response.body.clonePlaylist  
    expect(response.statusCode).toBe(200)
    expect(response.body.clonePlaylist.user).toEqual(`${user2._id}`)
    expect(response.body.clonePlaylist.songs).toContain(`${song._id}`)
    expect(response.body.existingPlaylist.songs).toContain(`${song._id}`)
    expect(response.body.existingPlaylist.user).toEqual(`${user1._id}`)
    expect(response.body.existingPlaylist.cloned).toContain(`${user2._id}`)
    expect(response.body.cloningUser.playlists).not.toContain(`${playlist._id}`)
    expect(response.body.cloningUser.playlists).toContain(`${newPlaylist._id}`)
  })

  test('it should create a new comment on a playlist and add IDs into arrays on Comment, User, and Playlist', async () => {
    const user = new User({ name: 'Paul', email: 'paul@funtimes.fun', password: 'paulpaulpaul' })
    const playlist = new Playlist({ title: 'Bangers Only', public: true })
    const token = await user.generateAuthToken()
    await user.save()
    await playlist.save()

    const response = await request(app)
      .post(`/playlists/${user._id}/${playlist._id}/comment`)
      .send({
        commenterId: user._id,
        foundPlaylistId: playlist._id,
        commentBody: 'what a great playlist!'
      })
      .set('Authorization', `Bearer ${token}`)

    let commentId = response.body.comment._id 
      
    expect(response.statusCode).toBe(200)
    expect(response.body.comment.user).toEqual(`${user._id}`)
    expect(response.body.comment.playlist).toEqual(`${playlist._id}`)
    expect(response.body.commenter.comments).toContain(commentId)
    expect(response.body.playlist.comments).toContain(commentId)
    expect(response.body.comment.content).toEqual('what a great playlist!')
  })

  test('it should get an unowned public playlist by id', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaulpaul2' })
    const token = await user2.generateAuthToken()
    const playlist = new Playlist({ title: 'Bangers Only', user: user1._id, public: true })
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .get(`/playlists/${user2._id}/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.title).toEqual('Bangers Only')
    expect(response.body.user).toEqual(`${user1._id}`)
  })



// POSITIVE TEST CASES : SHARED PLAYLIST ACTIONS



  test(`it should index all of the user's shared playlists'`, async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaul2' })
    const playlist1 = new Playlist({ title: 'oh boy', sharedWith: [user1._id] })
    const playlist2 = new Playlist({ title: 'uh oh', sharedWith: [user2._id, user1._id]})
    const token = await user1.generateAuthToken()
    await user1.save()
    await user2.save()
    await playlist1.save()
    await playlist2.save()

    const response = await request(app)
      .get(`/playlists/${user1._id}/shared`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    
    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i].sharedWith).toContain(`${user1._id}`)
    }
  })

  test('it should add a song to the playlist and update both songs and playlists arrays via sharing between users', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const user2 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const token = await user2.generateAuthToken()
    const playlist1 = new Playlist({ title: 'PLAYLIST', user: user1._id, sharedWith: [user2._id] })
    const song1 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes' })
    user1.playlists.push(playlist1._id)
    user2.playlists.push(playlist1._id)
    await user1.save()
    await user2.save()
    await playlist1.save()
    await song1.save()

    const response = await request(app)
      .post(`/playlists/${playlist1._id}/songs/add`)
      .send({ songId: song1._id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.playlist.songs)).toBeTruthy()
    expect(Array.isArray(response.body.song.playlists)).toBeTruthy()
    expect(response.body.playlist.songs).toContain(`${song1._id}`)
    expect(response.body.song.playlists).toContain(`${playlist1._id}`)
  })

  test('it should remove a song from the playlist and update both songs and playlists arrays via sharing between users', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaul2' })
    const token = await user2.generateAuthToken()
    const playlist1 = new Playlist({ title: 'PLAYLIST', user: user1._id, songs: [] })
    const song1 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    const song2 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    const song3 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    user2.playlists.push(playlist1._id)
    playlist1.songs.push(song1._id, song2._id, song3._id)
    playlist1.sharedWith.push(user2._id)
    await user1.save()
    await user2.save()
    await playlist1.save()
    await song1.save()
    await song2.save()
    await song3.save()

    const response = await request(app)
      .post(`/playlists/${playlist1._id}/songs/remove`)
      .send({ songId: song1._id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.playlist.songs)).toBeTruthy()
    expect(response.body.message).toEqual(`Successfully removed song ${song1._id} from playlist ${playlist1._id}`)
    expect(response.body.playlist.songs).toEqual([`${song2._id}`, `${song3._id}`])
  })



// NEGATIVE TEST CASES : AUTHORIZATION



  test('it should fail to add a song to the playlist due to authorization', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const user2 = new User({ name: 'Paul', email: 'paul@paul.paul2', password: 'paulpaul' })
    const token = await user2.generateAuthToken()
    const playlist1 = new Playlist({ title: 'PLAYLIST', user: user1._id })
    const song1 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes' })
    user1.playlists.push(playlist1._id)
    await user1.save()
    await user2.save()
    await playlist1.save()
    await song1.save()

    const response = await request(app)
      .post(`/playlists/${playlist1._id}/songs/add`)
      .send({ songId: song1._id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(401)
    expect(playlist1.songs).not.toContain(`${song1._id}`)
    expect(song1.playlists).not.toContain(`${playlist1._id}`)
  })

  test('it should fail to remove a song from the playlist due to authorization', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const user2 = new User({ name: 'Paul', email: 'paul@paul.paul2', password: 'paulpaul' })
    const token = await user2.generateAuthToken()
    const playlist1 = new Playlist({ title: 'PLAYLIST', user: user1._id, songs: [] })
    const song1 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    const song2 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    const song3 = new Song({ title: 'banger', artist: 'Me', album: 'also Me', genre: 'cool tunes', playlists: [playlist1._id] })
    user1.playlists.push(playlist1._id)
    playlist1.songs.push(song1._id, song2._id, song3._id)
    await user1.save()
    await user2.save()
    await playlist1.save()
    await song1.save()
    await song2.save()
    await song3.save()

    const response = await request(app)
      .post(`/playlists/${playlist1._id}/songs/remove`)
      .send({ songId: song1._id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(401)
    expect(playlist1.songs).toContain(song1._id)
  })

  test('it should fail to create a new comment on a playlist due to authorization', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@funtimes.fun', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul', email: 'paul@funtimes.fun2', password: 'paulpaulpaul2' })
    const playlist = new Playlist({ title: 'Bangers Only', user: user2._id, public: true })
    const token = await user2.generateAuthToken()
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .post(`/playlists/${user1._id}/${playlist._id}/comment`)
      .send({
        commenterId: user1._id,
        playlistId: playlist._id,
        commentBody: 'what a great playlist!'
      })
      .set('Authorization', `Bearer ${token}`)
  
    expect(response.statusCode).toBe(401)
    expect(user1.comments).toEqual([])
    expect(playlist.comments).toEqual([])
  })

  test('it should not allow a user to share a playlist with another due to authorization', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaulpaul2' })
    const playlist = new Playlist({ title: 'share me!' })
    const token = await user1.generateAuthToken()
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
    .post(`/playlists/${playlist._id}/share`)
    .send({ userId: user2._id })
    .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(401)
    expect(playlist.sharedWith).not.toContain(`${user2._id}`)
    expect(user2.playlists).not.toContain(`${playlist._id}`)
  })

  test('it should fail to update a playlist due to authorization', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaulpaul2' })
    const token = await user2.generateAuthToken()
    const playlist = new Playlist({ title: 'Bangers Only', user: user1._id })
    user1.playlists.push(playlist._id)
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .put(`/playlists/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Only Good Songs' })
  
    expect(response.statusCode).toBe(401)
    expect(playlist.title).toEqual('Bangers Only')
  })

  test('It should fail to delete a playlist due to lack of authorization', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'otherguy', email: 'coolguy', password: 'whatever' })
    const token = await user2.generateAuthToken()
    const playlist = new Playlist({ title: 'Do not delete', user: user1._id })
    user1.playlists.push(playlist._id)
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .delete(`/playlists/${user2._id}/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)

      let allPlaylists = await Playlist.find({})
      expect(response.statusCode).toBe(401)
      expect(playlist).toHaveProperty('title')
      expect(user1.playlists).toContain(playlist._id)
  })



// NEGATIVE TEST CASES : PRIVACY



  test(`It should fail to clone an existing playlist and add it to the user's playlists due to privacy setting`, async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Other guy', email: 'coolguy@coolguy.cool', password: "doyouthinkimcool" })
    const token = await user2.generateAuthToken()
    const playlist = new Playlist({ title: 'Best playlist', user: user1._id, public: false })
    const song = new Song({ title: 'cool song', artist: 'cool artist', album: 'so so album', genre: 'electro-pop-punk-reggae' })
    playlist.songs.push(song._id)
    user1.playlists.push(playlist._id)
    await user1.save()
    await user2.save()
    await playlist.save()
    await song.save()

    const response = await request(app)
    .post(`/playlists/${user2._id}/${playlist._id}/clone`)
    .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(400)
    expect(user2.playlists).toEqual([])
  })

  test('it should fail to create a new comment on a playlist due to privacy settings', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@funtimes.fun', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@funtimes.fun2', password: 'paulpaulpaul2' })
    const playlist = new Playlist({ title: 'Bangers Only', user: user2._id, public: false })
    const token = await user1.generateAuthToken()
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .post(`/playlists/${user1._id}/${playlist._id}/comment`)
      .send({
        commenterId: user1._id,
        foundPlaylistId: playlist._id,
        commentBody: 'what a great playlist!'
      })
      .set('Authorization', `Bearer ${token}`)
  
    expect(response.statusCode).toBe(400)
    expect(user1.comments).toEqual([])
    expect(playlist.comments).toEqual([])
  })

  test('it should fail to get a playlist by id because of privacy setting on playlist', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const user2 = new User({ name: 'Paul2', email: 'paul@paul.paul2', password: 'paulpaulpaul2' })
    const token = await user2.generateAuthToken()
    const playlist = new Playlist({ title: 'Bangers Only', user: user1._id, public: false })
    await user1.save()
    await user2.save()
    await playlist.save()

    const response = await request(app)
      .get(`/playlists/${user2._id}/${playlist._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('playlist is set to private')
  })



  // NEGATIVE TEST CASES: MISC.



  test('it should fail to remove song from playlist because the song is already not on the playlist', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    const playlist = new Playlist({ title: 'Bangers Only', user: user._id, songs: [] })
    const song = new Song({ title: 'cool song', artist: 'cool artist', album: 'so so album', genre: 'electro-pop-punk-reggae' })
    user.playlists.push(playlist)
    const token = await user.generateAuthToken()
    await user.save()
    await playlist.save()
    await song.save()

    const response = await request(app)
      .post(`/playlists/${playlist._id}/songs/remove`)
      .send({ songId: song._id })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual(`Playlist ${playlist._id} does not include song ${song._id}`)
  })
})

