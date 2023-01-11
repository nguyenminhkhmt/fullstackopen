import { createSlice } from '@reduxjs/toolkit'
import blogsSerice from '../services/blogs'
import { setMessageWithTimeout } from './messageReducer'
import { logout } from './userReducer'

const initialState = []

const slice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    append(state, action) {
      return state.concat(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const id = action.payload.id
      return state
        .map(blog => blog.id !== id ? blog : action.payload)
        .sort((blog1, blog2) => { return blog2.likes - blog1.likes })
    },
    deleteBlogId(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id ? blog : null)
    }
  }
})

export const { append, setBlogs, updateBlog, deleteBlogId } = slice.actions

export const initialBlogs = () => {
  return async dispatch => {
    let blogs = await blogsSerice.getAll()
    blogs = blogs.sort((blog1, blog2) => { return blog2.likes - blog1.likes })
    console.log('initialBlogs:', blogs)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      let newBlog = await blogsSerice.postBlog(blog)
      dispatch(append(newBlog))
      const message = { type: 'success', body: `${newBlog.title} by ${newBlog.author} is created!` }
      dispatch(setMessageWithTimeout(message))
    } catch (error) {
      dispatch(handleError(error))
    }
  }
}

export const addLike = (id) => {
  return async dispatch => {
    try {
      let newBlog = await blogsSerice.addLike(id)
      dispatch(updateBlog(newBlog))
      const message = { type: 'success', body: `you liked ${newBlog.title}` }
      dispatch(setMessageWithTimeout(message))
    } catch (error) {
      dispatch(handleError(error))
    }
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    try {
      // console.log(id, comment)
      let newBlog = await blogsSerice.addComment(id, comment)
      dispatch(updateBlog(newBlog))
      const message = { type: 'success', body: 'comment added' }
      dispatch(setMessageWithTimeout(message))
    } catch (error) {
      dispatch(handleError(error))
    }
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    try {
      await blogsSerice.deleteBlog(blog.id)
      dispatch(deleteBlogId(blog.id))
      const message = { type: 'success', body: `${blog.title} by ${blog.author} is deleted` }
      dispatch(setMessageWithTimeout(message))
    } catch (error) {
      dispatch(handleError(error))
    }
  }
}

const handleError = (error) => {
  return async dispatch => {
    const message = { type: 'failed', body: error.message }
    dispatch(setMessageWithTimeout(message))
    // console.log(error.message)
    if (error.response.status === 401) {
      if (window.confirm(`${error.message}! Please try login again`)) {
        dispatch(logout())
      }
    }
  }
}

const blogsReducer = slice.reducer
export default blogsReducer