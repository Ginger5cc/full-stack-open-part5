import { useState } from 'react'
import React from 'react'

const CreateBlogForm = ({ create }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createa = (event) => {
    event.preventDefault()
    create({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={createa}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder='Title'
          data-testid = 'title'
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='Author'
          data-testid='author'
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder='Url'
          data-testid='url'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}
export default CreateBlogForm