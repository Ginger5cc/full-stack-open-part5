import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import React from 'react'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Christy',
    url: 'www.christy.com',
    likes: 0,
    user: {
      'username': 'Juno Wong',
      'name': 'Helpinghand',
      'id': '668c24ff61697de630a2a2f5'
    },
  }

  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.bloglist')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library by Christy'
  )
  expect(div).not.toHaveTextContent(
    'www.christy.com'
  )
  expect(div).not.toHaveTextContent(
    '0'
  )
})