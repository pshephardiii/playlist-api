const request = require('supertest') 
const { MongoMemoryServer } = require('mongodb-memory-server') 
const app = require('../app') 
const User = require('../models/user') 
const mongoose = require('mongoose')
const server = app.listen(8080, () => console.log('Testing on Port 8080'))
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

describe('Test suite for the /users routes on our api', () => {
  
  test('It should create a new user in the database', async () => {
    const response = await request(app).post('/users').send({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })

    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('Paul')
    expect(response.body.user.email).toEqual('paul@paul.paul')
    expect(response.body).toHaveProperty('token')
  })

  test('It should login a user', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    await user.save()

    const response = await request(app)
      .post('/users/login')
      .send({ email: 'paul@paul.paul', password: 'paulpaulpaul' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('Paul')
    expect(response.body.user.email).toEqual('paul@paul.paul')
    expect(response.body).toHaveProperty('token')
  })

  test('It should update a user', async () => {
    const user = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaulpaul' })
    await user.save()
    const token = await user.generateAuthToken()

    const response = await request(app)
      .put(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luap', email: 'luap@luap.luap' })

    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual('Luap')
    expect(response.body.email).toEqual('luap@luap.luap')
  })

  test('It should delete a user', async () => {
    const user = new User({ name: 'Paul', email: 'paul@.paul.paul', password: 'paulpaulpaul' })
    await user.save()
    const token = await user.generateAuthToken()

    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
  })
})

