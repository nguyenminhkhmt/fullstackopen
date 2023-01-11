import { connect, useSelector } from 'react-redux'
import { addLike, addComment } from '../reducers/blogReducer'
import { deleteBlog } from '../reducers/blogReducer'
import { v4 } from 'uuid'
import { useState } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import blogSevice from '../services/blogs'
import { useEffect } from 'react'

const CommentForm = (props) => {
  const { id, addComment } = props
  const [comment, setComment] = useState('')

  const handleAddComment = (event) => {
    event.preventDefault()
    addComment(id, comment)
    setComment('')
  }

  return (
    <Form name='comment-form' onSubmit={handleAddComment}>
      <Form.Control id='comment-value' value={comment} onChange={({ target }) => setComment(target.value)} />
      <Button style={{ width: '150px' }} id='comment-create' type="submit">add comment</Button>
    </Form>
  )
}

const Comments = ({ comments, addComment, id }) => {
  return (
    <div>
      <h2>Comments</h2>
      <CommentForm addComment={addComment} id={id} />
      <ul>
        {comments.map(comment => <li key={v4()}>{comment}</li>)}
      </ul>
    </div>
  )
}

const useBlog = (blogId, blogs) => {
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    if (blogs) {
      const data = blogs.find(blog => blog.id === blogId)
      if (data) {
        setBlog(data)
        return
      }
    }

    blogSevice.getBlog(blogId).then(data => {
      setBlog(data)
    })
  }, [blogId, blogs])

  return blog
}

const BlogDetail = (props) => {
  const { blogId, addComment } = props
  const blogs = useSelector(state => state.blogs)
  const blog = useBlog(blogId, blogs)

  const handleLike = (event) => {
    event.preventDefault()
    props.addLike(blog.id)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    props.deleteBlog(blog)
  }

  const buttonStyle = {
    width: '100px',
    margin: '5px'
  }

  if (blog === null) {
    return (
      <div>
        ...loading
      </div>
    )
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <Table striped>
        <tbody>
          <tr>
            <td>URL:</td>
            <td><a href={`https://${blog.url}`}>{blog.url}</a></td>
          </tr>
          <tr>
            <td>likes:</td>
            <td>{blog.likes}</td>
          </tr>
          <tr>
            <td>added by:</td>
            <td>{blog.user.name}</td>
          </tr>
        </tbody>
      </Table>
      <Button style={buttonStyle} id='blog-like' onClick={handleLike}>like</Button>
      <Button style={{ ...buttonStyle, backgroundColor: 'red' }} id='blog-delete' onClick={handleDelete}>remove</Button>
      <Comments comments={blog.comments} addComment={addComment} id={blog.id} />
    </div>
  )
}

const mapDispatchToProps = {
  addLike,
  deleteBlog,
  addComment
}

const connectedBlogDetail = connect(
  null,
  mapDispatchToProps
)(BlogDetail)

export default connectedBlogDetail