import { useState } from 'react'

const Blog = (({ blog, addLikes, deleteBlog, user }) => {
    const blogStyle = {
        paddingTop: 12,
        paddingLeft: 4,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 4
    }

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = () => {
        const blogObject = {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1,
        }
        addLikes(blog.id, blogObject)
    }

    const handleDelete = () => {
        deleteBlog(blog.id)
    }

    const showDelete = blog.user.name === user.name

    return (
        <div style={blogStyle} className='blog'>
            <div style={hideWhenVisible} className="hiddenBlog">
                {blog.title} {blog.author}
                <button onClick={toggleVisibility} >view</button>
            </div>
            <div style={showWhenVisible} className="shownBlog">
                {blog.title} {blog.author}
                <button onClick={toggleVisibility} >hide</button>
                <p>{blog.url}</p>
                <p>
                    Likes: {blog.likes}
                    <button id='like-button' onClick={handleLike}>like</button>
                </p>
                <p>
                    {blog.user.username}
                </p>
                {showDelete && <button onClick={handleDelete} id='remove-button'>remove</button>}
            </div>
        </div>
    )})

export default Blog