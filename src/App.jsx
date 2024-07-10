import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notifications'
import CreateBlogForm from './components/CreateBlog'
import Togglable from './components/Togglable'

const App = () => {
  const tempError = {content: 'some error happened...', type: "notice"}
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const handleLogin = async(event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage({content: 'Wrong credentials', type: 'error'})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username: 
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password: 
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleCreate = async( blogObject ) => {
    
    try{
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      
      setBlogs( blogs.concat(newBlog) )
      setErrorMessage({
        content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'notice'
      })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage({content: 'Missing Content', type: 'error'})
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  

if (user === null) {
  return (
    <div>
      <h2>Log in to application</h2>
      <Notification errorMessage={errorMessage} />
      {loginForm()}
    </div>
  )
}

return (
  <div>
    <h2>Blogs</h2>
    <Notification errorMessage={errorMessage} />
    <form onSubmit={handleLogout}>
    <p>{user.username} logged in <button type="submit">logout</button></p>
    </form>
    <h2>Create New Blogs</h2>
    <Togglable buttonLabel ='create new blog' ref={blogFormRef} >
      <CreateBlogForm
        create = {handleCreate}
      /> 
    </Togglable>
    <p></p>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)}


export default App