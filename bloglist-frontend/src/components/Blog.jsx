import { useState } from 'react'
import React from 'react'

const Blog = ({ blog, addLike, remove, user }) => {
  const [showMore, setShowMore] = useState(false)

  const toggle = () => {
    setShowMore(!showMore)
  }

  const likeClick = () => {
    const blogAddlike = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    addLike(blog.id, blogAddlike)
  }

  const removeClick = () => {
    if (window.confirm(`remove ${blog.title} by ${blog.author}`)) {remove(blog.id, blog)}
    //remove(blog.id, blog)
  }

  let hideWhenShow = { display: showMore ? 'none' : '' }
  let showWhenShow = { display: showMore ? '' : 'none' }
  let sameUser = { display: (user.id === blog.user.id)? '' : 'none' }


  return (
    <div data-testid='toggleElement'>
      <div style={hideWhenShow} className='bloglist' data-testid={`toggleShow${blog.title}`} role='toggleShow'>
        {blog.title} by {blog.author}
        <button onClick={toggle} data-testid={`view${blog.title}`}>View</button>
      </div>
      <div style={showWhenShow} className='bloglist' data-testid='toggleHide'>
        <p>{blog.title}<button onClick={toggle}>hide</button></p>
        <p>{blog.url}</p>
        <p data-testid={`likeField${blog.title}`} className='likeField'>{blog.likes}
          <button onClick={likeClick} data-testid={`like${blog.title}`}>like</button>
        </p>
        <p>{blog.user.name}</p>
        <button style={sameUser} onClick={removeClick} data-testid={`remove${blog.title}`}>remove</button>
      </div>
    </div>
  )
}

export default Blog