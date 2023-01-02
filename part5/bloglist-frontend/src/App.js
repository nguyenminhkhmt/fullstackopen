import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Message from './components/Message'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const Control = (props) => {
  const blogFormRef = useRef()
  const { user, setUser, username, password, setUsername, setPassword, setMessage, setBlogs, blogs } = props

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedAppUser', JSON.stringify(user))

      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ type: 'failed', body: 'Wrong credentials' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const createBlog = async (newBlog) => {
    try {
      const blog = await blogService.postBlog(newBlog)
      setBlogs(blogs.concat(blog).sort((b1, b2) => { return b2.likes - b1.likes }))
      blogFormRef.current.toggleVisibility()
      handleMessage({ type: 'success', body: `a new blog ${blog.title} by ${blog.author} added` }, setMessage)
    } catch (error) {
      handleMessage({ type: 'failed', body: `${error.message}` }, setMessage)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedAppUser')
    setUsername('')
    setPassword('')
    setUser(null)
    blogService.setToken(null)
  }

  if (user === null) {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  } else {
    return (
      <div>
        <p>
          {user.name} logged-in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel='create a new blog' ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      </div>
    )
  }
}

const handleMessage = (message, setMessage) => {
  setMessage(message)
  setTimeout(() => {
    setMessage(null)
  }, 5000)
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll()
      .then(blogs => blogs.sort((b1, b2) => { return b2.likes - b1.likes }))
      .then(blogs => setBlogs(blogs))
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addLike = async (blog) => {
    const userId = blog.user.id !== null ? blog.user.id : blog.user

    let updatedBlog = { ...blog, 'likes': blog.likes + 1, 'user': userId }
    console.log('updatedBlog:', updatedBlog)
    try {
      const updatedBlog1 = await blogService.putBlog(updatedBlog)
      console.log('result:', updatedBlog1)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog1.id ? blog : updatedBlog1).sort((b1, b2) => { return b2.likes - b1.likes }))
      const message = { body: `${blog.title}'s likes is updated!`, type: 'success' }
      handleMessage(message, setMessage)
    } catch (error) {
      handleMessage({ type: 'failed', body: `${error.message}` }, setMessage)
    }
  }

  const deleteBlog = async (deletedBlog) => {
    try {
      if (!window.confirm(`Remove blog ${deletedBlog.title} by ${deletedBlog.author}?`)) {
        return
      }

      console.log('delete: ', deletedBlog)
      await blogService.deleteBlog(deletedBlog)
      setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id).sort((b1, b2) => { return b2.likes - b1.likes }))
      const message = { body: `${deletedBlog.title} is deleted!`, type: 'success' }
      handleMessage(message, setMessage)
    } catch (error) {
      handleMessage({ type: 'failed', body: `${error.message}` }, setMessage)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Message message={message} />
      <Control
        user={user}
        setUser={setUser}
        setMessage={setMessage}
        setUsername={setUsername}
        setPassword={setPassword}
        username={username}
        password={password}
        blogs={blogs}
        setBlogs={setBlogs}
      />
      {<br />}
      <h2>all blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App
