import { useState } from 'react'
import { connect } from 'react-redux'
import { addLike, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog, addLike, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = (event) => {
    event.preventDefault()
    addLike(blog.id)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    deleteBlog(blog)
  }

  if (visible) {
    return (
      <div className='blog' style={showWhenVisible}>
        {blog.title} <button onClick={toggleVisibility} >hide</button> <br />
        <label>{blog.url}</label> <br />
        <label>likes {blog.likes}</label> <button id='blog-like' onClick={handleLike}>like</button><br />
        {blog.author} <br />
        <button id='blog-delete' onClick={handleDelete}>remove</button>
      </div>
    )
  } else {
    return (
      <div className='blog' style={hideWhenVisible}>
        {blog.title} by {blog.author} <button onClick={toggleVisibility} >view</button>
      </div>
    )
  }
}

const Blogs = (props) => {
  const { blogs, addLike, deleteBlog } = props

  return (
    <div>
      <h2>all blogs</h2>
      {blogs.map(blog => <Blog
        key={blog.id}
        blog={blog}
        addLike={addLike}
        deleteBlog={deleteBlog}
      />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

const mapDispatchToProps = {
  addLike,
  deleteBlog
}

const connectedBlogs = connect(
  mapStateToProps,
  mapDispatchToProps
)(Blogs)

export default connectedBlogs