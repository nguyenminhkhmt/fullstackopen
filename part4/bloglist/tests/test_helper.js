const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 3
  },
  {
    title: 'Go To Statement Considered Harmful 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 4
  },
  {
    title: 'Go To Statement Considered Harmful 3',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Someone',
    url: 'https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.title)
}

const blogIdsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.id)
}

const nonExistingBlogId = async () => {
  const sample = {
    title: '1001 night stories',
    author: 'someone',
    url: 'https://www.google.com',
    likes: 0
  }
  const blog = await Blog(sample)
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDB, nonExistingBlogId, blogIdsInDB, usersInDb
}