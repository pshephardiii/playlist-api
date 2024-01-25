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

  test('It should associate two users as contacts', async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    await user1.save()
    const token1 = await user1.generateAuthToken()
    const user2 = new User({ name: 'other', email: 'other', password: 'other' })
    await user2.save()
    const token2 = await user2.generateAuthToken()
        
    const response = await request(app)
      .post(`/users/contacts/${user1._id}/${user2._id}`)
      .set('Authorization', `Bearer ${token1}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.user1.contacts)).toBeTruthy()
    expect(Array.isArray(response.body.user2.contacts)).toBeTruthy()
    expect(response.body.user1.contacts).toContain(`${user2._id}`)
    expect(response.body.user2.contacts).toContain(`${user1._id}`)
  })

  test("It should remove two users from each other's contacts arrays", async () => {
    const user1 = new User({ name: 'Paul', email: 'paul@paul.paul', password: 'paulpaul' })
    const token1 = await user1.generateAuthToken()
    const user2 = new User({ name: 'other', email: 'other', password: 'other' })
    const token2 = await user2.generateAuthToken()
    const user3 = new User({ name: 'other', email: 'other', password: 'other' })
    const token3 = await user3.generateAuthToken()
    user1.contacts.push(user2._id, user3._id)
    user2.contacts.push(user1._id, user3._id)
    user3.contacts.push(user1._id, user2._id)
    await user1.save()
    await user2.save()
    await user3.save()

    const response = await request(app)
      .post(`/users/contacts/${user1._id}/remove/${user2._id}`)
      .set('Authorization', `Bearer ${token1}`)

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.user1.contacts)).toBeTruthy()
      expect(response.body.message).toEqual(`Successfully disassociated user with id ${user1._id} from user with id ${user2._id}`)
      expect(response.body.user1.contacts).toEqual([`${user3._id}`])
      expect(response.body.user2.contacts).toEqual([`${user3._id}`])
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

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('User deleted')
  })
})

