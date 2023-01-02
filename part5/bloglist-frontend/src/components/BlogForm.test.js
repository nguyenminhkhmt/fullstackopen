import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'A new test blog')
  await user.type(inputs[1], 'A Author')
  await user.type(inputs[2], 'abc.com')
  await user.click(sendButton)

  // console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('A new test blog')
  expect(createBlog.mock.calls[0][0].author).toBe('A Author')
  expect(createBlog.mock.calls[0][0].url).toBe('abc.com')
})