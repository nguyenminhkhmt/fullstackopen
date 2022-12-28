const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, _, next) => {
  logger.info('\n')
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('-------------')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token

  next()
}

const userExtractor = async (request, response, next) => {
  try {
    const token = getTokenFrom(request)
    if (token) {
      // eslint-disable-next-line no-undef
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken.id) {
        const user = await User.findById(decodedToken.id)
        request.user = user
        console.log('userExtractor: done')
      }
    }
    next()
  }
  catch (error) {
    next(error)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}