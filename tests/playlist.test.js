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
  
  // wait for Tuesday... authentication business here
  test('It should index all playlists', async () => {
        const playlist1 = new Playlist ({ title: 'title1' })
        const playlist2 = new Playlist ({ title: 'title2' })
        const playlist3 = new Playlist ({ title: 'title3' })
        await playlist1.save()
        await playlist2.save()
        await playlist3.save()
    
        const response = await request(app)
          .get('/playlists')
    
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
    
        for(let i = 0; i < response.body.length; i++) {
          expect(response.body[i]).toHaveProperty('title')
        }
        
      })  

})