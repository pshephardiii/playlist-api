const request = require('supertest') 
const { MongoMemoryServer } = require('mongodb-memory-server') 
const app = require('../app') 
const Song = require('../models/song') 
const mongoose = require('mongoose')
const server = app.listen(3002, () => console.log('Testing on Port 3002'))
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

describe('Test suite for the /songs routes on our api', () => {
  
  test('It should index all songs', async () => {
    const song1 = new Song ({ title: 'title1', artist: 'artist1', album: 'album1', genre: 'genre1' })
    const song2 = new Song ({ title: 'title2', artist: 'artist2', album: 'album2', genre: 'genre2' })
    const song3 = new Song ({ title: 'title3', artist: 'artist3', album: 'album3', genre: 'genre3' })
    await song1.save()
    await song2.save()
    await song3.save()

    const response = await request(app)
      .get('/songs')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()

    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i]).toHaveProperty('artist')
      expect(response.body[i]).toHaveProperty('album')
      expect(response.body[i]).toHaveProperty('genre')
    }
  })  
  
  test('It should index songs based on title', async () => {
    const song1 = new Song ({ title: 'title1', artist: 'artist1', album: 'album1', genre: 'genre1' })
    const song2 = new Song ({ title: 'title1', artist: 'artist2', album: 'album2', genre: 'genre2' })
    const song3 = new Song ({ title: 'title3', artist: 'artist3', album: 'album3', genre: 'genre3' })

    const response = await request(app)
      .get('/songs/title/title1')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()

    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i].title).toEqual('title1')
      expect(response.body[i]).toHaveProperty('artist')
      expect(response.body[i]).toHaveProperty('album')
      expect(response.body[i]).toHaveProperty('genre')
    }
  })

  test('It should index songs based on artist', async () => {
    const song1 = new Song ({ title: 'title1', artist: 'artist1', album: 'album1', genre: 'genre1' })
    const song2 = new Song ({ title: 'title2', artist: 'artist1', album: 'album2', genre: 'genre2' })
    const song3 = new Song ({ title: 'title3', artist: 'artist3', album: 'album3', genre: 'genre3' })

    const response = await request(app)
      .get('/songs/artists/artist1')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()

    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i].artist).toEqual('artist1')
      expect(response.body[i]).toHaveProperty('album')
      expect(response.body[i]).toHaveProperty('genre')
    }
  })

  test('It should index songs based on album', async () => {
    const song1 = new Song ({ title: 'title1', artist: 'artist1', album: 'album1', genre: 'genre1' })
    const song2 = new Song ({ title: 'title2', artist: 'artist2', album: 'album1', genre: 'genre2' })
    const song3 = new Song ({ title: 'title3', artist: 'artist3', album: 'album3', genre: 'genre3' })

    const response = await request(app)
      .get('/songs/albums/album1')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()

    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i]).toHaveProperty('artist')
      expect(response.body[i].album).toEqual('album1')
      expect(response.body[i]).toHaveProperty('genre')
    }
  })

  test('It should index songs based on artist and album', async () => {
    const song1 = new Song ({ title: 'title1', artist: 'artist1', album: 'album1', genre: 'genre1' })
    const song2 = new Song ({ title: 'title2', artist: 'artist1', album: 'album1', genre: 'genre2' })
    const song3 = new Song ({ title: 'title3', artist: 'artist3', album: 'album3', genre: 'genre3' })

    const response = await request(app)
      .get('/songs/artists/artist1/albums/album1')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()

    for(let i = 0; i < response.body.length; i++) {
        expect(response.body[i]).toHaveProperty('title')
        expect(response.body[i].artist).toEqual('artist1')
        expect(response.body[i].album).toEqual('album1')
        expect(response.body[i]).toHaveProperty('genre')
      }
  })

  test('It should index songs based on genre', async () => {
    const song1 = new Song ({ title: 'title1', artist: 'artist1', album: 'album1', genre: 'genre1' })
    const song2 = new Song ({ title: 'title2', artist: 'artist2', album: 'album2', genre: 'genre1' })
    const song3 = new Song ({ title: 'title3', artist: 'artist3', album: 'album3', genre: 'genre3' })

    const response = await request(app)
      .get('/songs/genre/genre1')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()

    for(let i = 0; i < response.body.length; i++) {
      expect(response.body[i]).toHaveProperty('title')
      expect(response.body[i]).toHaveProperty('artist')
      expect(response.body[i]).toHaveProperty('album')
      expect(response.body[i].genre).toEqual('genre1')
    }
  })

  test('It should get a specific song based on id', async () => {
    const song = new Song({ title: 'Yeah', artist: 'Wham', album: 'Oh Baby', genre: 'Pop Funk' })
    await song.save()

    const response = await request(app)
      .get(`/songs/${song._id}`)
  
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toEqual('Yeah')
    expect(response.body.artist).toEqual('Wham')
    expect(response.body.album).toEqual('Oh Baby')
    expect(response.body.genre).toEqual('Pop Funk')
  })
})