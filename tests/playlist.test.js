const request = require('supertest') 
const { MongoMemoryServer } = require('mongodb-memory-server') 
const app = require('../app') 
const User = require('../models/user') 
const Playlist = require('../models/playlist')
const mongoose = require('mongoose')
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
  
  test('It should create a new playlist and at it to the user playlists array', async () => {
    const user1 = new User({ name: 'paul', email: 'paul', password: 'paul' })
    user1.save()
    const response = await request(app).post('/playlists').send({ title: 'PLAYLIST', user: user1._id })
  
    expect(response.body.playlist.title).toEqual('PLAYLIST')

  })

})