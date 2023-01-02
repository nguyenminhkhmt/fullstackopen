import { useState } from 'react'

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
      <form name='blog-form' onSubmit={addBlog}>
        <fieldset>
          <legend>New blog</legend>
          <div>
            title:
            <input id='blog-title' value={newBlog.title} onChange={handleTitleChange} />
          </div>
          <div>
            author:
            <input id='blog-author' value={newBlog.author} onChange={handleAuthorChange} />
          </div>
          <div>
            url:
            <input id='blog-url' value={newBlog.url} onChange={handleUrlChange} />
          </div>
          <button id='blog-create' type="submit">create</button>
        </fieldset>
      </form>
    </div>
  )
}

export default BlogForm