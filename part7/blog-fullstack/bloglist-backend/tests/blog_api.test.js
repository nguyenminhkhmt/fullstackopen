const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

let token = ''
let userId = ''
beforeEach(async () => {
  const loginParams = {
    username: 'root',
    password: '12345678'
  }
  const result = await api
    .post('/api/login')
    .send(loginParams)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  token = result.body.token
  userId = result.body.id
  console.log('token, userId:', token, userId)

  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => {
    blog.user = userId
    return new Blog(blog)
  })
  const promiseArr = blogObjects.map(obj => obj.save())
  await Promise.all(promiseArr)
})

describe('when request blog api', () => {
  // 4.8: Blog list tests, step1
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are several blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  // 4.9*: Blog list tests, step2
  test('the first blog is about something', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0]).toBeDefined()

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
    expect(titles).toContain('Go To Statement Considered Harmful 2')
    expect(titles).toContain('Go To Statement Considered Harmful 3')
    expect(titles).toContain('Canonical string reduction')
  })

  // 4.10: Blog list tests, step3
  test('a valid blog can be added', async () => {
    const sample = {
      title: '1001 Night Stories',
      author: 'someone',
      url: 'https://www.google.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(sample)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsInDB = await helper.blogsInDB()
    // console.log('blogsInDB', blogsInDB)

    expect(blogsInDB).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsInDB).toContain('1001 Night Stories')
  })

  // 4.11*: Blog list tests, step4
  test('while likes property is missing from the request', async () => {
    const sample = {
      title: '1001 Night Stories',
      author: 'someone',
      url: 'https://www.google.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(sample)

    console.log(response.body)
    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toEqual(0)
  })

  // 4.12*: Blog list tests, step5
  test('try to add invalid blog data', async () => {
    const sample = {
      title: '1001 Night Stories'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(sample)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  // 4.13 Blog list expansions, step1
  // Implement functionality for deleting a single blog post resource & write test
  test('delete a blog', async () => {
    let blogIds = await helper.blogIdsInDB()
    console.log('ids before:', blogIds)
    const id = blogIds[0]

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    blogIds = await helper.blogIdsInDB()
    console.log('ids after:', blogIds)
    expect(blogIds).not.toContain(id)
  })

  // 4.14 Blog list expansions, step2
  // Implement functionality for updating the information of an individual blog post & write test
  test('update a blog with valid data', async () => {
    let blogIds = await helper.blogIdsInDB()
    const id = blogIds[0]
    const sampleData = {
      'title': 'TechCrunch',
      'author': 'TechCrunch.com',
      'url': 'https://techcrunch.com',
      'likes': 20,
      'id': id,
      'user': userId
    }

    const response = await api
      .put(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(sampleData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toBeDefined()
    expect(response.body).toEqual(sampleData)
  })

  afterAll(() => {
    token = ''
    mongoose.connection.close()
  })
})