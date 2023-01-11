import { connect } from 'react-redux'
import { useRef, useState } from 'react'

import LoginForm from './LoginForm'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

import loginService from '../services/login'
import { createBlog } from '../reducers/blogReducer'
import { setMessageWithTimeout } from '../reducers/messageReducer'
import { setLogin, logout } from '../reducers/userReducer'

const Control = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const { user } = props
  console.log('Control: ', user)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      props.setLogin(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      props.setMessageWithTimeout({ type: 'failed', body: 'Wrong credentials' }, 5)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUsername('')
    setPassword('')
    props.logout()
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      props.createBlog(newBlog)
      blogFormRef.current.toggleVisibility()
      props.setMessageWithTimeout({ type: 'success', body: `a new blog ${newBlog.title} by ${newBlog.author} added` })
    } catch (error) {
      props.setMessageWithTimeout({ type: 'failed', body: `${error.message}` })
    }
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
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  createBlog,
  setMessageWithTimeout,
  setLogin,
  logout
}

const connectedControl = connect(
  mapStateToProps,
  mapDispatchToProps
)(Control)

export default connectedControl