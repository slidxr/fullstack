import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from "./components/Togglable.jsx";
import AddBlogForm from "./components/AddBlogForm.jsx";
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [changeMessage, setChangeMessage] = useState(null)
    const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
        setBlogs( blogs )
    )
  }, [])

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                setChangeMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
                setTimeout(() => {
                    setChangeMessage(null)
                }, 5000)
            })
    }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }}, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
          'loggedBlogappUser',
          JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
        setErrorMessage('Wrong credentials')
        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }
  }

  if (user === null) {
    return (
        <div>
          <h2>Log in to application</h2>
          <Notification message={errorMessage} />
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
    )
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  return (
      <div>
        <h2>blogs</h2>
        <Notification message={changeMessage} />
        <p>
          {user.name} logged in
          <button onClick={handleLogout}> logout </button>
        </p>
          <Togglable buttonLabel="create" ref={blogFormRef}>
              <AddBlogForm createBlog={addBlog} />
          </Togglable>
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )
}

export default App