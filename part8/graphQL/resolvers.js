const { AuthenticationError, UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('./src/utils/Config').SECRET

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./src/models/Author')
const Book = require('./src/models/Book')
const User = require('./src/models/User')

const resolvers = {
  Query: {
    allAuthors: async () => {
      return Author.find({})
    },
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      // console.log('.....', args)
      let filter = {}
      if (args.author) {
        filter.author = args.author
      }
      if (args.genre) {
        filter.genres = args.genre
      }
      return Book.find(filter).populate('author')
    },
    me: async (root, args, context) => {
      console.log(context)
      return context.currentUser
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genreList = books.map(book => book.genres)
      const mergeDedupe = (arr) => {
        return [...new Set([].concat(...arr))];
      }

      return mergeDedupe(genreList)
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id })
      return books.length
    }
  },
  Mutation: {
    addAuthor: async (root, args) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = new Author({ ...args })
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({ name: args.author })
      if (author === undefined || author === null) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.title
          })
        }
      }

      const book = new Book({ ...args, author: author.id })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args.title
        })
      }

      const retVal = book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: retVal })
      return retVal
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      console.log(currentUser)

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers