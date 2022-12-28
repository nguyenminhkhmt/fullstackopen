/* eslint-disable no-undef */
const MONGODB_URI = require('../utils/config').MONGODB_URI
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: String,
  likes: {
    type: Number,
    default: 0,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
})

blogSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const mongoUrl = MONGODB_URI
mongoose.connect(mongoUrl)

module.exports = mongoose.model('blogs', blogSchema)