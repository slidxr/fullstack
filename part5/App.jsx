import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable.jsx'
import AddBlogForm from './components/AddBlogForm.jsx'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [changeMessage, setChangeMessage] = useState(null)
    const [refreshBlog, setRefreshBlog] = useState(false)
    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs => {
            blogs.sort((a, b) => b.likes - a.likes)
            setBlogs( blogs )
        }
        )
    }, [refreshBlog])

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
                setRefreshBlog(!refreshBlog)
            })
    }

    const deleteBlog = (id) => {
        const blogToDelete = blogs.find(b => b.id === id)
        if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
            blogService
                .deleteBlog(id)
                .then(() => {
                    setBlogs(blogs.filter(b => b.id !== id))
                    setRefreshBlog(!refreshBlog)
                })
                .catch(() => {
                    setErrorMessage(
                        `Blog '${blogToDelete.title}' was already removed from server`
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                    setRefreshBlog(!refreshBlog)
                })
        }
    }

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }}, [],)

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
                            id='username'
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
              password
                        <input
                            id='password'
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button id="login-button" type="submit">login</button>
                </form>
            </div>
        )
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const addLikes = async (id, blogObject) => {
        await blogService.update(id, blogObject)
        setRefreshBlog(!refreshBlog)
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
                <Blog key={blog.id} blog={blog} addLikes={addLikes} deleteBlog={deleteBlog} user={user}/>
            )}
        </div>
    )
}

export default App