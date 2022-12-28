const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  try {
    const user = request.user
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      user: user.id
    })

    const saveBlog = await blog.save()
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()
    return response.status(201).json(saveBlog)
  } catch (error) {
    // console.log('error:', error)
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      if (blog.user && blog.user.toString() === user.id) {
        await Blog.findByIdAndDelete(request.params.id)
        user.blogs = user.blogs.filter(id => id.toString() !== request.params.id)
        // console.log('blogs:', user.blogs)
        await user.save()

        return response.status(204).end()
      } else {
        return response.status(401).json({ error: 'You don\'t have permission to delete this' })
      }
    } else {
      response.status(204).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    // console.log('result:', result)
    response.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter