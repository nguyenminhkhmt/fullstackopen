import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('A blog component should', () => {
  let container
  let addLikeHandler
  let deleteHandler

  beforeEach(() => {
    const blog = {
      title: 'A new blog for lazy people',
      author: 'MM',
      likes: 10,
      url: 'abc.com'
    }

    addLikeHandler = jest.fn()
    deleteHandler = jest.fn()
    container = render(<Blog blog={blog} addLike={addLikeHandler} deleteBlog={deleteHandler}/>).container
  })

  test('Render content', () => {
    const element = screen.getByText('A new blog for lazy people by MM')
    expect(element).toBeDefined()
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('A new blog for lazy people by MM')
  })

  test('Render blog\'s url and buttons', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const button1 = screen.getByText('like')
    await user.click(button1)
    expect(addLikeHandler.mock.calls).toHaveLength(1)

    const urlElement = screen.getByText('abc.com')
    // screen.debug(urlElement)
    expect(urlElement).toBeDefined()

    const likeElement = screen.queryByText(/likes */)
    // screen.debug(likeElement)
    expect(likeElement).toBeDefined()

    const button2 = screen.getByText('remove')
    await user.click(button2)
    expect(deleteHandler.mock.calls).toHaveLength(1)
  })
})