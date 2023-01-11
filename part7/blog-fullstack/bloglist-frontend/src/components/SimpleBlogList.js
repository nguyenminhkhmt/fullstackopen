import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { setMessageWithTimeout } from '../reducers/messageReducer'
import { createBlog } from '../reducers/blogReducer'

import { Table } from 'react-bootstrap'

const BlogRow = ({ blog }) => {
  return (
    <tr className='blog'>
      <td>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} by {blog.author}
        </Link>
      </td>
    </tr>
  )
}

const SimpleBlogList = (props) => {
  const { blogs, user } = props
  const blogFormRef = useRef()

  const handleCreateBlog = async (newBlog) => {
    try {
      props.createBlog(newBlog)
      blogFormRef.current.toggleVisibility()
      props.setMessageWithTimeout({ type: 'success', body: `a new blog ${newBlog.title} by ${newBlog.author} added` })
    } catch (error) {
      props.setMessageWithTimeout({ type: 'failed', body: `${error.message}` })
    }
  }

  return (
    <div>
      {user !== null ?
        <Togglable buttonLabel='create a new blog' ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable> :
        null
      }

      <Table borderless>
        <tbody>
          {blogs.map(blog => <BlogRow
            key={blog.id}
            blog={blog}
          />
          )}
        </tbody>
      </Table>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

const mapDispatchToProps = {
  setMessageWithTimeout,
  createBlog
}

const connectedSimpleBlogList = connect(mapStateToProps, mapDispatchToProps)(SimpleBlogList)
export default connectedSimpleBlogList