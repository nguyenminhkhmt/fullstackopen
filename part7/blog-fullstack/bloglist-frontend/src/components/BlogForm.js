import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const emptyBlog = {
    title: '',
    author: '',
    url: ''
  }
  const [newBlog, setNewBlog] = useState(emptyBlog)

  const handleTitleChange = async (event) => {
    setNewBlog({ ...newBlog, 'title': event.target.value })
  }

  const handleAuthorChange = async (event) => {
    setNewBlog({ ...newBlog, 'author': event.target.value })
  }

  const handleUrlChange = async (event) => {
    setNewBlog({ ...newBlog, 'url': event.target.value })
  }

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog(newBlog)
    setNewBlog(emptyBlog)
    const frm = document.getElementsByName('blog-form')[0]
    frm.reset()
  }

  return (
    <div className='formDiv'>
      <Form name='blog-form' onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control type="text" id='blog-title' value={newBlog.title} onChange={handleTitleChange} />
          <Form.Label>author:</Form.Label>
          <Form.Control type="text" id='blog-author' value={newBlog.author} onChange={handleAuthorChange} />
          <Form.Label>url:</Form.Label>
          <Form.Control type="text" id='blog-url' value={newBlog.url} onChange={handleUrlChange} />
          <br/>
          <Button id='blog-create' type="submit">create</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm