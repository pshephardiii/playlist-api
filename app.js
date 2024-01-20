const express = require('express')
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')
const playlistRoutes = require('./routes/playlistRoutes')
// const songRoutes = require('.routes/songRoutes')
const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use('/users', userRoutes)
app.use('/playlists', playlistRoutes)
// app.use('/songs', songRoutes)

module.exports = app