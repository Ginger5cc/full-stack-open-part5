import { render, screen } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateBlogForm from './CreateBlog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Christy',
    url: 'www.christy.com',
    likes: 200,
    user: {
      'username': 'Juno Wong',
      'name': 'Helpinghand',
      'id': '668c24ff61697de630a2a2f5'
    }
  }


  beforeEach(() => {
    const user = userEvent.setup()

    render(<Blog blog={blog} user={user}/>)
  })

  test('at start only show title and author without url and likes', async () => {
    const element = screen.getByRole('toggleShow')
    expect(element).toHaveTextContent(
      'Component testing is done with react-testing-library by Christy'
    )
    expect(element).not.toHaveTextContent(
      'www.christy.com'
    )
    expect(element).not.toHaveTextContent(
      '0'
    )
  })

  test('at start the children are not displayed', () => {
    const div = screen.getByTestId('toggleHide')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = screen.getByTestId('toggleHide')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('www.christy.com')
    expect(div).toHaveTextContent('200')
  })

})

describe('Test Like button and Create Button', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Christy',
    url: 'www.christy.com',
    likes: 200,
    user: {
      'username': 'Juno Wong',
      'name': 'Helpinghand',
      'id': '668c24ff61697de630a2a2f5'
    }
  }

  test('like button is clicked twice', async () => {
    const addLike = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} addLike={addLike} user={user}/>)
    const button = screen.getByText('View')
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(addLike.mock.calls).toHaveLength(2)
  })

  test('create a blog with the right props', async() => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateBlogForm create={createBlog}/>)

    const input = screen.getByPlaceholderText('Title')
    const input2 = screen.getByPlaceholderText('Author')
    const input3 = screen.getByPlaceholderText('Url')
    const sendButton = screen.getByText('create')

    await user.type(input, 'input the title...')
    await user.type(input2, 'input the author...')
    await user.type(input3, 'input the url...')
    await user.click(sendButton)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('input the title...')
    expect(createBlog.mock.calls[0][0].author).toBe('input the author...')
    expect(createBlog.mock.calls[0][0].url).toBe('input the url...')
    console.log(createBlog.mock.calls)
  })

})