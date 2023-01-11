import { useEffect } from 'react'
import { initialBlogs } from './reducers/blogReducer'
import { loadUser } from './reducers/userReducer'
import { useDispatch } from 'react-redux'
import { loadAllUser } from './reducers/usersReducer'

import SimpleBlogList from './components/SimpleBlogList'
import Message from './components/Message'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogDetail from './components/BlogDetail'
import Users from './components/Users'
import Menu from './components/Menu'
import UserDetail from './components/UserDetail'

import { Routes, Route } from 'react-router-dom'
import { useMatch, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
    dispatch(initialBlogs())
    dispatch(loadAllUser())
  }, [])

  const currentUser = useSelector(state => state.user)
  const userIdMatch = useMatch('users/:id')
  const fUserId = userIdMatch ? userIdMatch.params.id : null

  const blogIdMatch = useMatch('blogs/:id')
  const fBlogId = blogIdMatch ? blogIdMatch.params.id : null

  return (
    <div className='container'>
      <h2>Blogs</h2>
      <Message />
      <Menu />
      {currentUser === null ?
        <Togglable buttonLabel='login'>
          <LoginForm />
        </Togglable> :
        null
      }

      <Routes>
        <Route path="/blogs" element={<SimpleBlogList />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<SimpleBlogList />} />
        <Route path='/users/:id' element={
          fUserId !== undefined ?
            <UserDetail userId={fUserId} /> :
            <Navigate replace to='/users' />
        } />
        <Route path='/blogs/:id' element={
          fBlogId !== undefined ?
            <BlogDetail blogId={fBlogId} /> :
            <Navigate replace to='/blogs' />
        } />
      </Routes>
    </div>
  )
}

export default App
