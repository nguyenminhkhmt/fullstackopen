import axios from 'axios'
const baseUrl = '/api/blogs'
let token = ''

const getAll = async () => {
  const request = axios.get(baseUrl)
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

const deleteBlog = async (blog) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  const request = axios.delete(`${baseUrl}/${blog.id}`, config)
  const response = await request
  return response.data
}

const setToken = (newToken) => {
  token = newToken
}

const blogRouter = { getAll, postBlog, setToken, deleteBlog, putBlog }
export default blogRouter