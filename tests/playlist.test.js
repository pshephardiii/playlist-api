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
  
  test('It should index all playlists', async () => {

        const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
        await user.save()
        const token = await user.generateAuthToken()
        const playlist1 = new Playlist ({ title: 'title1', user: `${user._id}` })
        const playlist2 = new Playlist ({ title: 'title2', user: `${user._id}` })
        const playlist3 = new Playlist ({ title: 'title3', user: `${user._id}` })
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
        }
      })

    test('it should create a new playlist', async () => {
      const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
      await user.save()
      const token = await user.generateAuthToken()

      const response = await request(app)
        .post('/playlists').send({ title: 'Bangers Only', user: `${user._id}` })
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.title).toEqual('Bangers Only')
      expect(response.body.user).toEqual(`${user._id}`)
    })

    // update test when playlist can be shared with multiple users
    
    test('it should update a playlist', async () => {
        const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
        await user.save()
        const token = await user.generateAuthToken()
        const playlist = new Playlist({ title: 'Bangers Only', user: `${user._id}` })
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
        await user.save()
        const token = await user.generateAuthToken()
        const playlist = new Playlist({ title: 'Bangers Only', user: `${user._id}` })
        await playlist.save()

        const response = await request(app)
          .delete(`/playlists/${playlist._id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual(`Playlist ${playlist._id} deleted`)
    })

    test('it should get a playlist by id', async () => {
        const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
        await user.save()
        const token = await user.generateAuthToken()
        const playlist = new Playlist({ title: 'Bangers Only', user: `${user._id}` })
        await playlist.save()

        const response = await request(app)
          .get(`/playlists/${playlist._id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('Bangers Only')
        expect(response.body.user).toEqual(`${user._id}`)
    })
})