import axios from 'axios'
const baseUrl = '/api/blogs'
let token = ''

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const getBlog = async (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  const response = await request
  return response.data
}

const postBlog = async (blog) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  const request = axios.post(baseUrl, blog, config)
  const response = await request
  return response.data
}

const putBlog = async (blog) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const request = axios.put(`${baseUrl}/${blog.id}`, blog, config)
  const response = await request
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  const response = await request
  return response.data
}

const addLike = async (id) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  // fetch data with id first
  const blogResponse = await axios.get(`${baseUrl}/${id}`)
  let blog = blogResponse.data
  const response = await axios.put(`${baseUrl}/${id}`, { likes: blog.likes + 1 }, config)
  return response.data
}

const addComment = async (id, comment) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment: comment }, config)
  return response.data
}

const setToken = (newToken) => {
  token = newToken
}

const blogRouter = { getAll, getBlog, postBlog, setToken, deleteBlog, putBlog, addLike, addComment }
export default blogRouter