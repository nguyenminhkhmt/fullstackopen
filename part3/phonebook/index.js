/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// Config BE
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs')
  const morgan = require('morgan')
  // create a write stream (in append mode)
  // Check the log file access.log
  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

  morgan.token('user-data', function (request) {
    return request.body ? JSON.stringify(request.body) : ''
  })
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :user-data', { stream: accessLogStream }))
}

app.get('/', (_, response) => {
  response.send('<h1>It works!</h1>')
})

app.get('/api/persons', (_, response, next) => {
  Person.find({}).then(persons => {
    if (persons) {
      response.send(persons)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log('id', id)
  Person.findById(id)
    .then(person => {
      if (person) {
        console.log(person)
        response.send(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (_, response, next) => {
  const date = Date()
  Person.count({}).then(count => {
    const msg = `Phonebook has info for ${count} people<br/>${date}`
    response.send(`<p>${msg}</p>`)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(persons => {
    if (persons) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const data = request.body
  if (!data.name || !data.number) {
    return response.status(400).json({ error: 'Invalid params' })
  }

  console.log('add new person')
  const person = new Person({
    name: data.name,
    number: data.number
  })

  person.save().then(person => {
    if (person) {
      return response.json(person)
    } else {
      return response.status(400).end()
    }
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const data = request.body
  if (!data.name || !data.number) {
    return response.status(400).json({ error: 'Invalid params' })
  }

  const id = request.params.id
  Person.findByIdAndUpdate(
    id,
    { name: data.name, number: data.number },
    { new: true, runValidators: true, context: 'query' })
    .then(person => {
      response.json(person)
    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})