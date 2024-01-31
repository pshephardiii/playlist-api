const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ _id: data._id })
    if (!user) {
      throw new Error(`Could not locate user ${data._id}`)
    }
    req.user = user
    if(req.params.userId){
      if (req.params.userId !== data._id){
        throw new Error('Not authorized')
      }
    }
    if (req.params.playlistId){
      if (!(user.playlists.includes(req.params.playlistId))){
        throw new Error('Not authorized')
      }
    }
    next()
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

exports.indexUsers = async (req, res) => {
  try{
    const foundUsers = await User.find({})
    res.status(200).json(foundUsers)
  } catch(error){
    res.status(400).json({ message: error.message })
  }
}

exports.indexContacts = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
    if (!user) throw new Error(`Could not locate user ${req.params.userId}`)
    const foundContacts = await User.find({ contacts: [user._id ]})
    res.status(200).json(foundContacts)
  } catch (error) {
    res.status(400).jseon({ message: error.message })
  }
}

exports.createUser = async (req, res) => {
  try{
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(200).json({ user, token })
  } catch(error){
    res.status(400).json({ message: error.message })
  }
}

exports.loginUser = async (req, res) => {
  try{
    const user = await User.findOne({ email: req.body.email })
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      res.status(400).send('Invalid login credentials')
    } else {
      const token = await user.generateAuthToken()
      res.status(200).json({ user, token })
    }
  } catch(error){
    res.status(400).json({ message: error.message })
  }
}

exports.addContact = async (req, res) => {
  try{
    const user1 = await User.findOne({ _id: req.params.userId })
    if (!user1) throw new Error(`Could not find user ${req.params.userId}`)
    const user2 = await User.findOne({ _id: req.params.contactId })
    if (!user2) throw new Error(`Could not find user ${req.params.contactId}`)
    user1.contacts.push(user2._id)
    user2.contacts.push(user1._id)
    await user1.save()
    await user2.save()
    res.status(200).json({
      message: `Successfully associated user with id ${user1._id} with user with id ${user2._id}`,
      user1: user1,
      user2: user2
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.removeContact = async (req, res) => {
  try {
    const user1 = await User.findOne({ _id: req.params.userId })
    if (!user1) throw new Error(`Could not find user ${req.params.userId}`)
    const user2 = await User.findOne({ _id: req.params.contactId })
    if (!user2) throw new Error(`Could not find user ${req.params.contactId}`)
    const userIndex1 = user1.contacts.indexOf(user2._id)
    if (!(user1.contacts.includes(user2._id))) throw new Error(`User ${user2._id} is not a saved as a contact with ${user1._id}`)
    const userIndex2 = user2.contacts.indexOf(user1._id)
    if (!(user2.contacts.includes(user1._id))) throw new Error(`User ${user1._id} is a saved as a contact with ${user2._id}`)
    user1.contacts.splice(userIndex1, 1)
    user2.contacts.splice(userIndex2, 1)
    await user1.save()
    await user2.save()
    res.status(200).json({
      message: `Successfully disassociated user with id ${user1._id} from user with id ${user2._id}`,
      user1: user1,
      user2: user2
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try{
    const updates = Object.keys(req.body)
    const user = await User.findOne({ _id: req.params.userId })
    if (!user) throw new Error(`Could not locate user ${req.params.userId}`)
    updates.forEach(update => user[update] = req.body[update])
    await user.save()
    res.status(200).json(user)
  }catch(error){
    res.status(400).json({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try{
    await req.user.deleteOne()
    res.status(200).json({ message: 'User deleted' })
  }catch(error){
    res.status(400).json({ message: error.message })
  }
}

exports.showUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.params.id })
    if (!foundUser) throw new Error(`Could not locate user ${req.params.id}`)
    res.status(200).json(foundUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
